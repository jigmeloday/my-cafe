import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";

import { RegisterForm } from "./components/register-form";
import { REGISTER_COPY } from "./constant/register.constant";

export const metadata: Metadata = { title: "Create account — kuzu" };

export default function RegisterPage() {
  return (
    <AuthCard
      title={REGISTER_COPY.title}
      description={REGISTER_COPY.description}
      footerText={REGISTER_COPY.footerText}
      footerLink={REGISTER_COPY.footerLink}
    >
      <RegisterForm />
    </AuthCard>
  );
}
