import { z } from "zod";

import { ACCOUNT_TYPES } from "@/lib/constants";

const email = z
  .string()
  .trim()
  .min(1, "Enter your email")
  .email("Enter a valid email");
const password = z.string().min(8, "Use at least 8 characters");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z.object({
  accountType: z.enum(ACCOUNT_TYPES),
  name: z.string().trim().min(2, "Enter your name"),
  email,
  password,
});

export const googleAuthSchema = z.object({
  accountType: z.enum(ACCOUNT_TYPES).optional(),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
