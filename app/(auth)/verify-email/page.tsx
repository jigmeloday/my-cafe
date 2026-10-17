import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { z } from "zod";

import { AuthCard } from "@/components/auth/auth-card";

import { ResendVerification } from "./components/resend-verification";
import { VERIFY_COPY } from "./constant/verify-email.constant";

export const metadata: Metadata = { title: "Verify your email — kuzu" };

export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const { email: raw } = await searchParams;
  const email = z.string().max(254).pipe(z.email()).safeParse(typeof raw === "string" ? raw : "");
  // Without an address there is nothing to resend to: go to log in, which brings people back here if needed.
  if (!email.success) redirect("/login");

  return (
    <AuthCard
      title={VERIFY_COPY.title}
      description={
        <>
          {VERIFY_COPY.sentTo} <strong className="break-all font-semibold text-foreground">{email.data}</strong>.
        </>
      }
      footerText={VERIFY_COPY.wrongAddress}
      footerLink={{ label: VERIFY_COPY.startAgain, href: "/register" }}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4 rounded-2xl bg-maroon-soft p-4">
          <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <ol className="list-decimal space-y-1 pl-4 text-sm marker:text-primary">
            {VERIFY_COPY.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <p className="text-sm text-muted-foreground">{VERIFY_COPY.tips}</p>
        <ResendVerification email={email.data} />
      </div>
    </AuthCard>
  );
}
