import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { getCurrentUser, HOME_BY_ROLE } from "@/lib/session";

import { ResendByEmail } from "./components/resend-by-email";
import { EXPIRED_CODES, PROBLEM_COPY } from "./constant/verified.constant";

export const metadata: Metadata = { title: "Email verification — Nook" };

/** Where the link in the verification email lands. */
export default async function VerifiedPage({ searchParams }: PageProps<"/verified">) {
  const { error } = await searchParams;

  if (typeof error === "string" && error) {
    return (
      <AuthCard
        title={PROBLEM_COPY.title}
        description={EXPIRED_CODES.includes(error) ? PROBLEM_COPY.expired : PROBLEM_COPY.invalid}
        footerText={PROBLEM_COPY.back}
        footerLink={{ label: PROBLEM_COPY.login, href: "/login" }}
      >
        <ResendByEmail />
      </AuthCard>
    );
  }

  // The link worked and signed them in: send them to their own home. If it was opened in a browser they
  // aren't signed in on, ask them to log in.
  const user = await getCurrentUser();
  redirect(user ? HOME_BY_ROLE[user.role] : "/login?verified=1");
}
