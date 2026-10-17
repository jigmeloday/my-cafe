import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import { VERIFICATION_MINUTES, verificationService } from "@/services/auth/verification.service";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  // Nobody can log in until they confirm their email. A wrong password is still reported as a wrong
  // password: the "not verified" answer is only given to someone who knows the password.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
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
