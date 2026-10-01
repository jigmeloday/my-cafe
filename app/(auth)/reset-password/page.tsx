import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";

import { ResetPasswordForm } from "./components/reset-password-form";
import { RESET_COPY } from "./constant/reset-password.constant";

export const metadata: Metadata = { title: "Reset password — kuzu" };

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title={RESET_COPY.title}
      description={RESET_COPY.description}
      footerText={RESET_COPY.footerText}
      footerLink={RESET_COPY.footerLink}
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
