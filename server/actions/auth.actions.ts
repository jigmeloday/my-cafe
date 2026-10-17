"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeNextPath } from "@/lib/redirect";
import { HOME_BY_ROLE } from "@/lib/session";

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
  error: "This isn't connected yet. Accounts are coming soon.",
};

const messageFor = (error: unknown, fallback: string): string =>
  error instanceof APIError && error.message ? error.message : fallback;

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return INVALID;

  try {
    await auth.api.signInEmail({ body: { email: parsed.data.email, password: parsed.data.password } });
  } catch (error) {
    return { ok: false, error: messageFor(error, "Wrong email or password.") };
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email }, select: { role: true, status: true } });
  if (!user || user.status === "SUSPENDED") {
    await auth.api.signOut({ headers: await headers() });
    return { ok: false, error: "This account has been suspended." };
  }
  redirect(safeNextPath(parsed.data.next) ?? HOME_BY_ROLE[user.role]);
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return INVALID;
  const { accountType, name, email, password } = parsed.data;

  try {
    await auth.api.signUpEmail({ body: { name, email, password } });
  } catch (error) {
    return { ok: false, error: messageFor(error, "We couldn't create your account.") };
  }

  await db.user.update({ where: { email }, data: { role: accountType } });
  redirect(HOME_BY_ROLE[accountType]);
}

export async function logoutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
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
