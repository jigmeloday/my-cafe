import type { Metadata } from "next";

import { guardArea } from "@/lib/session";

import { AuthCard } from "@/components/auth/auth-card";

import { ForgotPasswordForm } from "./components/forgot-password-form";
import { FORGOT_COPY } from "./constant/forgot-password.constant";

export const metadata: Metadata = { title: "Forgot password — kuzu" };

export default async function ForgotPasswordPage() {
  // Already signed in: go to your own area instead.
  await guardArea("auth");

  return (
    <AuthCard
      title={FORGOT_COPY.title}
      description={FORGOT_COPY.description}
      footerText={FORGOT_COPY.footerText}
      footerLink={FORGOT_COPY.footerLink}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
