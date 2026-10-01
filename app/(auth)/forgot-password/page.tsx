import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";

import { ForgotPasswordForm } from "./components/forgot-password-form";
import { FORGOT_COPY } from "./constant/forgot-password.constant";

export const metadata: Metadata = { title: "Forgot password — kuzu" };

export default function ForgotPasswordPage() {
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
