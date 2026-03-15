// import { model, Schema } from "mongoose";
// import { TUser } from "./auth.interface";

// const user_schema = new Schema<TUser>({
//   firstName: { type: String, required: [true, "First Name is required"] },
//   lastName: { type: String, required: [true, "Last Name is required"] },
//   // phone_number: {
//   //   type: String,
//   //   required: [true, "Phone Number is required"],
//   //   min: [11, "Phone number must be at least 11 character"],
//   // },
//   email: { type: String, required: [true, "Email is required"], unique: true },
//   password: { type: String, required: [true, "Password is required"] },
//   profileImage: { type: String, required: false },
//   role: { type: String, required: true, enum: RoleEnum.options, default: "USER" },
//   isVerified: { type: Boolean, default: true },
//   lastOTP: { type: String, required: false },
//   otpExpiresAt: { type: Date, required: false },
//   isActive: { type: String, enum: AccountStatusEnum.options, default: "ACTIVE" },
//   isDeleted: { type: Boolean, default: false },
// });

// export const User_Model = model("User", user_schema);


import { model, Schema } from "mongoose";
import { TUser } from "./auth.interface";
import { ACCOUNT_STATUS, USER_ROLE } from "../../../constants/auth.constant";

const user_schema = new Schema<TUser>({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },

  lastName: {
    type: String,
    // required: [true, "Last Name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  profileImage: {
    type: String,
  },

  role: {
    type: String,
    enum: Object.values(USER_ROLE),
    default: USER_ROLE.USER,
  },

  isVerified: {
    type: Boolean,
    default: true,
  },

  lastOTP: String,

  otpExpiresAt: Date,

  isActive: {
    type: String,
    enum: Object.values(ACCOUNT_STATUS),
    default: ACCOUNT_STATUS.ACTIVE,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const User_Model = model("User", user_schema);