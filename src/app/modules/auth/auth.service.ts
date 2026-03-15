import { Secret } from "jsonwebtoken";
import config from "../../config";
import { AppError } from "../../utils/app_error";
import { jwtHelpers } from "../../utils/JWT";
import { TUser } from "./auth.interface";
import { User_Model } from "./auth.schema";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/send_email";
import { OTPMaker } from "../../utils/otp_maker";
import { otpEmailTemplate } from "../../utils/otpTemplate";

const sign_up_user_into_db = async (payload: TUser) => {
  const { email } = payload;

  const isUserExist = await User_Model.findOne({ email });
  if (isUserExist) {
    throw new AppError(409, "Account already exist! Try with new email.");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const modifiedData = { ...payload, password: hashedPassword };

  const user = await User_Model.create(modifiedData);

  // const otp = OTPMaker();
  // await User_Model.findOneAndUpdate({ email }, { lastOTP: otp });

  // const otpDigits = otp.split("");

  // const emailTemp = `
  //   <table ...>
  //     ...
  //     <tr>
  //       ${otpDigits
  //         .map(
  //           (digit) => `
  //           <td align="center" valign="middle"
  //             style="background:#f5f3ff; border-radius:12px; width:56px; height:56px;">
  //             <div style="font-size:22px; line-height:56px; color:#111827; font-weight:700; text-align:center;">
  //               ${digit}
  //             </div>
  //           </td>
  //           <td style="width:12px;">&nbsp;</td>
  //         `
  //         )
  //         .join("")}
  //     </tr>
  //     ...
  //   </table>
  // `;

  // await sendEmail(email, "Your OTP", emailTemp);
  // user.lastOTP = otp;
  await user.save();

  // return "Check your email for verification OTP";
  return "Registration successful";
};

const login_user_into_db = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await User_Model.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isDeleted === true) {
    throw new AppError(404, "Your account has been deleted");
  }

  if (user.isVerified === false) {
    throw new AppError(401, "Account not verified");
  }

  const isPasswordMatch = await bcrypt.compare(password, user?.password as string);

  if (!isPasswordMatch) {
    throw new AppError(403, "Wrong password!!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: user?.email,
      role: user?.role,
      accountId: user?._id,
    },
    config.access_token_secret as Secret,
    config.access_token_expires_in as string
  );

  // Generate token valid for 1 hour
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
  //   expiresIn: "1h",
  // });

  // // Create verification link
  // const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  // // Email content
  // const html = `
  //   <div>
  //     <h3>Welcome to Our App</h3>
  //     <p>Click below to verify your email:</p>
  //     <a href="${verifyUrl}"
  //        style="background: #007bff; color: white; padding: 10px 20px;
  //        text-decoration: none; border-radius: 4px;">
  //        Verify Email
  //     </a>
  //   </div>
  // `;

  // // Send email
  // await sendEmail(email, "Verify your email", html);

  return { accessToken, role: user?.role };
};

const change_password_into_db = async (payload: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const { email, oldPassword, newPassword } = payload;

  if (oldPassword === newPassword) {
    throw new AppError(409, "New password must be different from old password");
  }

  const user = await User_Model.findOne({ email, isDeleted: false, isVerified: true });
  if (!user) {
    throw new AppError(404, "User not found!!");
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatch) {
    throw new AppError(409, "Wrong password!!");
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  const updatedUser = await user.save();
  if (!updatedUser) {
    throw new AppError(500, "Failed to change password. Please try again later.");
  }

  return updatedUser;
};

const forgot_password = async (emailInput: string | { email: string }) => {
  const email = typeof emailInput === "string" ? emailInput : emailInput.email;

  const user = await User_Model.findOne({ email, isDeleted: false });
  if (!user) throw new AppError(404, "User not found");

  const otp = OTPMaker();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await User_Model.findOneAndUpdate({ email }, { lastOTP: otp, otpExpiresAt });

  const emailTemp = otpEmailTemplate(otp, "Reset Your Password");

  await sendEmail(email, "Password Reset OTP", emailTemp);

  return "Check your email for OTP";
};

const reset_password_into_db = async (email: string, otp: string, newPassword: string) => {
  const user = await User_Model.findOne({ email });
  if (!user) throw new AppError(404, "User not found");

  const verifyOTP = user.lastOTP === otp //&& user.otpExpiresAt! > new Date();
  if (!verifyOTP) {
    throw new AppError(409, "Invalid OTP");
  }

  if (user.otpExpiresAt! < new Date()) {
    throw new AppError(409, "OTP has expired");
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = newHashedPassword;

  const updatedUser = await user.save();
  if (!updatedUser) {
    throw new AppError(500, "Failed to change password. Please try again later.");
  }

  return "";
};

const verify_db_otp = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;
  const user = await User_Model.findOne({ email, isDeleted: false });

  if (!user) {
    throw new AppError(404, "This user not exist");
  }

  const lastOTP = user.lastOTP;
  if (lastOTP !== otp) {
    throw new AppError(401, "Wrong otp!!");
  }

  user.isVerified = true;
  const updatedUser = await user.save();

  if (!updatedUser) {
    throw new AppError(500, "OTP verification failed!");
  }

  return "OTP verification successful";
};

const refresh_token_into_db = async (emailInput: string | { email: string }) => {
  const email = typeof emailInput === "string" ? emailInput : emailInput.email;

  const user = await User_Model.findOne({ email, isDeleted: false });
  if (!user) throw new AppError(404, "User not found");

  const accessToken = jwtHelpers.generateToken(
    {
      email: user?.email,
      role: user?.role,
      accountId: user?._id,
    },
    config.access_token_secret as Secret,
    config.access_token_expires_in as string
  );

  return { accessToken, role: user?.role };
};

const resend_otp_into_db = async (emailInput: string | { email: string }) => {
  const email = typeof emailInput === "string" ? emailInput : emailInput.email;

  const user = await User_Model.findOne({ email, isDeleted: false });
  if (!user) throw new AppError(404, "User not found");

  const otp = OTPMaker();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await User_Model.findOneAndUpdate({ email }, { lastOTP: otp, otpExpiresAt });

  const emailTemp = otpEmailTemplate(otp, "Resend OTP");

  await sendEmail(email, "Resend OTP", emailTemp);

  return "Check your email for OTP";
};

const update_user_name_into_db = async (payload: { email: string; [key: string]: any }) => {
  const { email, ...rest } = payload;

  const user = await User_Model.findOne({ email, isDeleted: false });
  if (!user) throw new AppError(404, "User not found");

  const updatedUser = await User_Model.findOneAndUpdate({ email }, rest, { new: true });
  if (!updatedUser) throw new AppError(500, "Failed to update user");

  return updatedUser;
};

const update_profile_image_into_db = async (email: string, imageUrl: string) => {
  const updatedUser = await User_Model.findOneAndUpdate(
    { email },
    { profileImage: imageUrl },
    { new: true }
  );

  if (!updatedUser) {
    throw new AppError(404, "User not found or failed to update profile image");
  }

  return updatedUser;
};

const delete_account_from_db = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await User_Model.findOne({ email, isDeleted: false });
  if (!user) throw new AppError(404, "User not found");

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw new AppError(409, "Wrong password!!");

  user.isDeleted = true;
  const updatedUser = await user.save();
  if (!updatedUser) throw new AppError(500, "Failed to delete account");

  return "Account deleted successfully";
};

const get_me_from_db = async (email: string) => {
  const user = await User_Model.findOne({ email, isDeleted: false }).select(
    "-password -lastOTP -otpExpiresAt"
  );
  if (!user) throw new AppError(404, "User not found");
  
  return user;
};

export const auth_service = {
  sign_up_user_into_db,
  verify_db_otp,
  login_user_into_db,
  change_password_into_db,
  forgot_password,
  reset_password_into_db,
  refresh_token_into_db,
  resend_otp_into_db,
  update_user_name_into_db,
  update_profile_image_into_db,
  delete_account_from_db,
  get_me_from_db,
};
