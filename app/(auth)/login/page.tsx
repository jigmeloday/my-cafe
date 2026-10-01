import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";

import { LoginForm } from "./components/login-form";
import { LOGIN_COPY } from "./constant/login.constant";

export const metadata: Metadata = { title: "Log in — kuzu" };

export default function LoginPage() {
  return (
    <AuthCard
      title={LOGIN_COPY.title}
      description={LOGIN_COPY.description}
      footerText={LOGIN_COPY.footerText}
      footerLink={LOGIN_COPY.footerLink}
    >
      <LoginForm />
    </AuthCard>
  );
}
