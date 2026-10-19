import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import { RESET_MINUTES, passwordResetService } from "@/services/auth/password-reset.service";
import { VERIFICATION_MINUTES, verificationService } from "@/services/auth/verification.service";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  // Nobody can log in until they confirm their email. A wrong password is still reported as a wrong
  // password: the "not verified" answer is only given to someone who knows the password.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    // "Forgot password": the link is emailed (and works once, for an hour). Choosing a new password signs the
    // person out everywhere, and they're emailed so they notice if it wasn't them.
    resetPasswordTokenExpiresIn: RESET_MINUTES * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => passwordResetService.sendLink(user, url),
    onPasswordReset: async ({ user }) => passwordResetService.notifyChanged(user),
    // Signing up with an email that already has an account looks identical on screen, so nobody can use the
    // form to find out who is registered. The real owner is told by email instead.
    onExistingUserSignUp: async ({ user }) => {
      if (user.emailVerified) await verificationService.notifyAccountExists(user);
      else await auth.api.sendVerificationEmail({ body: { email: user.email, callbackURL: "/verified" } });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    // Clicking the link in the email also logs them in, so they land straight in the app.
    autoSignInAfterVerification: true,
    expiresIn: VERIFICATION_MINUTES * 60,
    sendVerificationEmail: async ({ user, url }) => verificationService.send(user, url),
  },
  // A session lasts a week and is refreshed daily while used. Cookies are HttpOnly and SameSite=Lax always,
  // and Secure in production, so scripts can't read them and other sites can't send them.
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
  trustedOrigins: [process.env.BETTER_AUTH_URL].filter((origin): origin is string => !!origin),
  // Login and sign-up through the browser address (/api/auth/...) get a tight limit too. Our own forms are
  // limited separately, in the server actions (services/auth/rate-limit.service.ts).
  rateLimit: {
    enabled: true,
    window: 60,
    max: 60,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
      "/send-verification-email": { window: 60, max: 3 },
    },
  },
  // Role and status are never accepted from the browser: they are set by the server only.
  user: {
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "USER" },
      status: { type: "string", input: false, defaultValue: "ACTIVE" },
    },
  },
  // Must be last: lets server actions set the session cookie.
  plugins: [nextCookies()],
});
