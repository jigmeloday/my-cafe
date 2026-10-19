import type { Metadata } from "next";

import { guardArea } from "@/lib/session";

import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

import { ResetPasswordForm } from "./components/reset-password-form";
import { RESET_COPY } from "./constant/reset-password.constant";

export const metadata: Metadata = { title: "Reset password — kuzu" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  // Already signed in: go to your own area instead.
  await guardArea("auth");
  const { token, error } = await searchParams;
  const valid = typeof token === "string" && token.length >= 10 && !error;

  if (!valid) {
    return (
      <AuthCard title={RESET_COPY.invalidTitle} description={RESET_COPY.invalidDescription} footerText={RESET_COPY.footerText} footerLink={RESET_COPY.footerLink}>
        <Button size="lg" className="w-full" nativeButton={false} render={<Link href="/forgot-password" />}>
          {RESET_COPY.invalidAction}
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={RESET_COPY.title}
      description={RESET_COPY.description}
      footerText={RESET_COPY.footerText}
      footerLink={RESET_COPY.footerLink}
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
