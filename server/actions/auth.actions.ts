"use server";

import {
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type GoogleAuthInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth.schema";

import type { ActionResult } from "./action.type";

const INVALID: ActionResult = {
  ok: false,
  error: "Please check the form and try again.",
};
const NOT_CONNECTED: ActionResult = {
  ok: false,
  error: "Sign-in isn't connected yet. Accounts are coming soon.",
};

// TODO: replace the NOT_CONNECTED returns with calls to the auth service
// once the auth provider and database are set up.
export async function loginAction(input: LoginInput): Promise<ActionResult> {
  return loginSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}

export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult> {
  return registerSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  return forgotPasswordSchema.safeParse(input).success
    ? NOT_CONNECTED
    : INVALID;
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<ActionResult> {
  return resetPasswordSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}

export async function googleAuthAction(
  input: GoogleAuthInput,
): Promise<ActionResult> {
  return googleAuthSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}
