import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { FormMessage } from "@/components/shared/form-message";

import { LoginForm } from "./components/login-form";
import { LOGIN_COPY } from "./constant/login.constant";

export const metadata: Metadata = { title: "Log in — kuzu" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, verified } = await searchParams;
  return (
    <AuthCard
      title={LOGIN_COPY.title}
      description={LOGIN_COPY.description}
      footerText={LOGIN_COPY.footerText}
      footerLink={LOGIN_COPY.footerLink}
    >
      {verified === "1" && <FormMessage tone="success">{LOGIN_COPY.verified}</FormMessage>}
      <LoginForm next={typeof next === "string" ? next : undefined} />
    </AuthCard>
  );
}
