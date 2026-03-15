import { ACCOUNT_STATUS, USER_ROLE } from "../../../constants/auth.constant";

export type TRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type TAccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export type TUser = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  profileImage?: string;
  role: TRole;
  isVerified?: boolean;
  lastOTP?: string;
  otpExpiresAt?: Date;
  isActive?: TAccountStatus;
  isDeleted?: boolean;
};