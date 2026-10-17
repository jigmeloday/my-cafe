import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8, autoSignIn: true },
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
