import { z } from "zod";
import { USER_ROLE } from "../../../constants/auth.constant";

export const AccountStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
export type TAccountStatus = z.infer<typeof AccountStatusEnum>;

/** User schema */
export const sign_up_schema = z.object({
  firstName: z.string("First name is required").min(1, "First name cannot be empty"),

  lastName: z.string("Last name is required").min(1, "Last name cannot be empty").optional(),

  email: z.string("Email is required").email("Please provide a valid email address"),

  password: z.string("Password is required").min(6, "Password must be at least 6 characters"),

  profileImage: z.string().optional(),

  role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]).optional(),

  isVerified: z.boolean().optional().default(true),

  lastOTP: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4,6}$/.test(v), {
      message: "OTP must be 4 to 6 digits",
    }),

  isActive: AccountStatusEnum.optional().default("ACTIVE"),

  isDeleted: z.boolean().optional().default(false),
});

export const login_schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string("Password is required"),
});

export const change_password_schema = z
  .object({
    oldPassword: z.string("oldPassword is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });

export const update_user_name_schema = z
  .object({
    firstName: z.string("First name is required").min(1, "First name cannot be empty").optional(),

    lastName: z.string("Last name is required").min(1, "Last name cannot be empty").optional(),
  })
  .refine((data) => data.firstName || data.lastName, {
    message: "At least one field is required",
    path: ["firstName", "lastName"],
  });

export const delete_account_schema = z.object({
  password: z.string("Password is required"),
});