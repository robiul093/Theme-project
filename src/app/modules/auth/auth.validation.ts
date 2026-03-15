import { email, z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "LEAD", "MEMBER"]);
export type TRole = z.infer<typeof RoleEnum>;

export const AccountStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
export type TAccountStatus = z.infer<typeof AccountStatusEnum>;

/** User schema */
export const sign_up_schema = z.object({
  firstName: z.string("First name is required").min(1, "First name cannot be empty"),

  lastName: z.string("Last name is required").min(1, "Last name cannot be empty"),

  phone_number: z
    .string("Phone number is required")
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),

  email: z.string("Email is required").email("Please provide a valid email address"),

  password: z.string("Password is required").min(6, "Password must be at least 6 characters"),

  role: RoleEnum,

  isVerified: z.boolean().optional().default(false),

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
