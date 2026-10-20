import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Clock } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters/date";
import { requireRole } from "@/lib/session";
import { kycService } from "@/services/kyc/kyc.service";

import { KycForm } from "./components/kyc-form";
import { KYC_COPY } from "./constant/kyc.constant";

export const metadata: Metadata = { title: "Verification — Nook business" };

export default async function VerificationPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const status = await kycService.state(user.id);

  return (
    <div className="space-y-6">
      <header className="max-w-2xl space-y-1">
        <h1>{KYC_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{KYC_COPY.subtitle}</p>
      </header>

      {status.state === "NO_BUSINESS" && (
        <EmptyState
          title={KYC_COPY.noBusinessTitle}
          description={KYC_COPY.noBusinessText}
          action={<Button render={<Link href="/business/profile" />}>Business profile</Button>}
        />
      )}

      {status.state === "VERIFIED" && (
        <div className="flex max-w-2xl items-start gap-4 rounded-xl border border-success/30 bg-success/10 p-5">
          <BadgeCheck className="mt-0.5 size-6 shrink-0 text-success" />
          <div className="space-y-1">
            <h2>{KYC_COPY.verifiedTitle}</h2>
            <p className="text-sm text-muted-foreground">{KYC_COPY.verifiedText}</p>
          </div>
        </div>
      )}

      {status.state === "PENDING" && (
        <div className="flex max-w-2xl items-start gap-4 rounded-xl border bg-surface p-5">
          <Clock className="mt-0.5 size-6 shrink-0 text-muted-foreground" />
          <div className="space-y-1">
            <h2>{KYC_COPY.pendingTitle}</h2>
            <p className="text-sm text-muted-foreground">{KYC_COPY.pendingText}</p>
            <p className="text-xs text-muted-foreground">Sent {formatDateTime(status.submittedAt)}</p>
          </div>
        </div>
      )}

      {status.state === "REJECTED" && (
        <div className="max-w-2xl space-y-2">
          <FormMessage tone="error">
            <strong>{KYC_COPY.rejectedTitle}.</strong> {status.reason}
          </FormMessage>
          <p className="text-sm text-muted-foreground">{KYC_COPY.rejectedHelp}</p>
        </div>
      )}

      {(status.state === "NOT_SUBMITTED" || status.state === "REJECTED") && <KycForm />}
    </div>
  );
}
