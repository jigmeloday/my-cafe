"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyEmailHref } from "@/lib/auth-paths";
import { safeNextPath } from "@/lib/redirect";
import { HOME_BY_ROLE } from "@/lib/session";
import { VERIFIED_PATH } from "@/services/auth/verification.service";

import {
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type GoogleAuthInput,
  type LoginInput,
  type RegisterInput,
  type ResendVerificationInput,
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

  let notVerified = false;
  try {
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password, callbackURL: VERIFIED_PATH },
    });
  } catch (error) {
    // Only someone who knows the right password gets this answer; a wrong password is reported as one.
    if (error instanceof APIError && error.body?.code === "EMAIL_NOT_VERIFIED") notVerified = true;
    else return { ok: false, error: messageFor(error, "Wrong email or password.") };
  }
  // A new verification email was already sent (at most one a minute). Take them where it says so.
  if (notVerified) redirect(verifyEmailHref(parsed.data.email));

  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() }, select: { role: true, status: true } });
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
  const startedAt = new Date();

  try {
    await auth.api.signUpEmail({ body: { name, email, password, callbackURL: VERIFIED_PATH } });
  } catch (error) {
    return { ok: false, error: messageFor(error, "We couldn't create your account.") };
  }

  // If the email already had an account, sign-up pretends to succeed and creates nothing. So the role is only
  // set on an account that was created during THIS sign-up, never on someone else's existing account.
  await db.user.updateMany({
    where: { email: email.toLowerCase(), emailVerified: false, role: "USER", createdAt: { gte: startedAt } },
    data: { role: accountType },
  });

  redirect(verifyEmailHref(email));
}

/** Sends a fresh verification link. The answer is always the same, so it can't be used to find out who has an account. */
export async function resendVerificationAction(input: ResendVerificationInput): Promise<ActionResult> {
  const parsed = resendVerificationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter a valid email address." };

  try {
    // Does nothing for unknown or already-verified addresses. A repeat within a minute is skipped quietly.
    await auth.api.sendVerificationEmail({ body: { email: parsed.data.email, callbackURL: VERIFIED_PATH } });
  } catch {
    // Same answer either way.
  }
  return { ok: true, message: "If that address has an account waiting to be verified, we've sent a new link." };
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
