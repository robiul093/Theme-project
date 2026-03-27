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

  favoritePacks: [
    {
      type: Schema.Types.ObjectId,
      ref: "CharacterPack",
    },
  ],

  favoriteMedia: [
    {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
  ],
});

export const User_Model = model("User", user_schema);