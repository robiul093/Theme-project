import { AppError } from "../../utils/app_error";
import catchAsync from "../../utils/catch_async";
import { uploadToCloudinary } from "../../utils/cloudinaryUploader";
import { sendResponse } from "../../utils/send_response";
import { auth_service } from "./auth.service";

const sign_up_user = catchAsync(async (req, res) => {
  const result = await auth_service.sign_up_user_into_db(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    // message: "Check your email for verification OTP",
    message: "Registration successful",
    data: result,
  });
});

const verify_otp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || typeof email !== "string") {
    throw new AppError(400, "Email is required for OTP verification");
  }
  if (!otp || typeof otp !== "string") {
    throw new AppError(400, "OTP is required and must be a string");
  }

  const payload = { email, otp };

  const result = await auth_service.verify_db_otp(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP verified successfully",
    data: result,
  });
});

const login_user = catchAsync(async (req, res) => {
  if (!req.body) {
    throw new AppError(404, "Payload not found");
  }

  const result = await auth_service.login_user_into_db(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: result,
  });
});

const change_password = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  const payload = { email, ...req.body };
  if (!payload) {
    throw new AppError(404, "Invalid request: payload is missing");
  }

  await auth_service.change_password_into_db(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password changed successfully",
  });
});

const forgot_password = catchAsync(async (req, res) => {
  if (!req.body) {
    throw new AppError(404, "Invalid request: payload is missing");
  }

  const result = await auth_service.forgot_password(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    // message: result,
    data: result,
  });
});

const reset_password = catchAsync(async (req, res) => {
  if (!req.body) {
    throw new AppError(404, "Payload not found");
  }
  const { email, otp, newPassword } = req.body;

  await auth_service.reset_password_into_db(email, otp, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password reset successfully",
  });
});

const refresh_token = catchAsync(async (req, res) => {
  if (!req.body) {
    throw new AppError(404, "Payload not found");
  }
  const result = await auth_service.refresh_token_into_db(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Token refreshed successfully",
    data: result,
  });
});

const resend_otp = catchAsync(async (req, res) => {
  if (!req.body) {
    throw new AppError(404, "Payload not found");
  }
  const result = await auth_service.resend_otp_into_db(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP resent successfully",
    data: result,
  });
});

const update_user_name = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  const { firstName, lastName } = req.body;
  const payload = { email, ...(firstName && { firstName }), ...(lastName && { lastName }) };
  if (!firstName && !lastName) {
    throw new AppError(404, "Invalid request: payload is missing");
  }

  await auth_service.update_user_name_into_db(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Name updated successfully",
  });
});

export const update_profile_image = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const file = req.file;
  
  if (!email) throw new AppError(401, "Unauthorized: email not found");
  if (!file) throw new AppError(400, "No image file uploaded");

  const uploaded = await uploadToCloudinary(file);
  
  await auth_service.update_profile_image_into_db(email, uploaded.url);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile image updated successfully",
    data: { imageUrl: uploaded.url },
  });
});

const delete_account = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  const { password } = req?.body;
  if (!email || !password) {
    throw new AppError(404, "Invalid request: password is missing");
  }
  const payload = { email, password };

  await auth_service.delete_account_from_db(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Account deleted successfully",
  });
});

export const get_me = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  if (!email) {
    throw new AppError(401, "Unauthorized");
  }

  const result = await auth_service.get_me_from_db(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User information retrieved successfully",
    data: result,
  });
});

export const auth_controller = {
  sign_up_user,
  verify_otp,
  login_user,
  change_password,
  forgot_password,
  reset_password,
  refresh_token,
  resend_otp,
  update_user_name,
  update_profile_image,
  delete_account,
  get_me,
};
