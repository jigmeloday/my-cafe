import type { Metadata } from "next";

import { guardArea } from "@/lib/session";

import { AuthCard } from "@/components/auth/auth-card";

import { RegisterForm } from "./components/register-form";
import { REGISTER_COPY } from "./constant/register.constant";

export const metadata: Metadata = { title: "Create account — kuzu" };

export default async function RegisterPage() {
  // Already signed in: go to your own area instead.
  await guardArea("auth");

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
