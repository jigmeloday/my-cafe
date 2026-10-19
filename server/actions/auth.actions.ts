"use server";

import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyEmailHref } from "@/lib/auth-paths";
import { safeNextPath } from "@/lib/redirect";
import { HOME_BY_ROLE } from "@/lib/session";
import { LIMITS, TOO_MANY, clientIp, loginKeys, rateLimit } from "@/services/auth/rate-limit.service";
import { RESET_PATH } from "@/services/auth/password-reset.service";
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

  // Too many wrong passwords for this account, or too many tries from this address: refuse without even
  // checking the password, and without saying which of the two it was.
  const ip = await clientIp();
  const keys = loginKeys(parsed.data.email, ip);
  if ((await rateLimit.isBlocked(keys.email, LIMITS.loginPerEmail)) || (await rateLimit.isBlocked(keys.ip, LIMITS.loginPerIp))) {
    return { ok: false, error: TOO_MANY };
  }

  let notVerified = false;
  try {
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password, callbackURL: VERIFIED_PATH },
    });
  } catch (error) {
    // Only someone who knows the right password gets this answer; a wrong password is reported as one.
    if (error instanceof APIError && error.body?.code === "EMAIL_NOT_VERIFIED") notVerified = true;
    else {
      // A wrong password counts against both the account and the address.
      await Promise.all([rateLimit.record(keys.email), rateLimit.record(keys.ip)]);
      return { ok: false, error: messageFor(error, "Wrong email or password.") };
    }
  }
  await rateLimit.clear(keys.email);
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

  // Every sign-up attempt counts, so the form can't be used to flood people with emails or fill the database.
  const ipKey = `register:ip:${await clientIp()}`;
  if (await rateLimit.isBlocked(ipKey, LIMITS.registerPerIp)) return { ok: false, error: TOO_MANY };
  await rateLimit.record(ipKey);

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

  const ipKey = `resend:ip:${await clientIp()}`;
  if (await rateLimit.isBlocked(ipKey, LIMITS.resendPerIp)) return { ok: false, error: TOO_MANY };
  await rateLimit.record(ipKey);

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

/**
 * Emails a link to choose a new password. The answer is always the same, whether or not the address has an
 * account, so this form can't be used to find out who is registered. Limited per address and per email.
 */
export async function forgotPasswordAction(input: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter a valid email address." };

  const ipKey = `forgot:ip:${await clientIp()}`;
  const emailKey = `forgot:email:${parsed.data.email.toLowerCase()}`;
  if ((await rateLimit.isBlocked(ipKey, LIMITS.forgotPerIp)) || (await rateLimit.isBlocked(emailKey, LIMITS.forgotPerEmail))) {
    return { ok: false, error: TOO_MANY };
  }
  await Promise.all([rateLimit.record(ipKey), rateLimit.record(emailKey)]);

  try {
    await auth.api.requestPasswordReset({ body: { email: parsed.data.email, redirectTo: RESET_PATH } });
  } catch {
    // Same answer either way.
  }
  return { ok: true, message: "If an account exists for that email, a reset link is on its way. It works for an hour." };
}

/** Sets a new password using the token from the emailed link. Signs the person out on every device. */
export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const ipKey = `reset:ip:${await clientIp()}`;
  if (await rateLimit.isBlocked(ipKey, LIMITS.resetPerIp)) return { ok: false, error: TOO_MANY };
  await rateLimit.record(ipKey);

  try {
    await auth.api.resetPassword({ body: { newPassword: parsed.data.password, token: parsed.data.token } });
  } catch (error) {
    // A used, expired or made-up token all look the same.
    return { ok: false, error: error instanceof APIError && error.body?.code === "PASSWORD_TOO_SHORT" ? "Choose a password with at least 8 characters." : "This link isn't valid any more. Ask for a new one." };
  }
  redirect("/login?reset=1");
}

export async function googleAuthAction(
  input: GoogleAuthInput,
): Promise<ActionResult> {
  return googleAuthSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}
