import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/formatters/date";
import { requireRole } from "@/lib/session";
import { kycService } from "@/services/kyc/kyc.service";

import { ReviewPanel } from "../components/review-panel";

export const metadata: Metadata = { title: "Review verification — kuzu admin" };
// Contains identity details, so this page is never cached.
export const dynamic = "force-dynamic";

const isPdf = (key: string) => key.endsWith(".pdf");

export default async function ReviewPage({ params }: PageProps<"/admin/verification/[id]">) {
  await requireRole("ADMIN");
  const { id } = await params;
  const detail = await kycService.detail(id);
  if (!detail) notFound();

  const rows: [string, string][] = [
    ["Name on ID", detail.ownerName],
    ["ID number", detail.idNumber],
    ["Trade licence number", detail.licenseNumber],
    ["Account", `${detail.accountName} · ${detail.accountEmail}`],
    ["Sent", formatDateTime(detail.submittedAt)],
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link href="/admin/verification" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Verification
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1>{detail.businessName}</h1>
          <StatusBadge tone={detail.status === "PENDING" ? "warning" : detail.status === "APPROVED" ? "success" : "danger"}>
            {detail.status === "PENDING" ? "Waiting" : detail.status === "APPROVED" ? "Approved" : "Sent back"}
          </StatusBadge>
        </div>
        <p className="text-xs text-muted-foreground">Opening a document is recorded in the audit log.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-4">
          <dl className="space-y-3 rounded-xl border bg-surface p-4 text-sm">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="font-medium break-words">{value}</dd>
              </div>
            ))}
          </dl>
          {detail.status === "PENDING" ? (
            <ReviewPanel id={detail.id} />
          ) : (
            detail.reviewNote && (
              <p className="rounded-xl bg-muted px-4 py-3 text-sm">
                <span className="font-medium">Reason given:</span> {detail.reviewNote}
              </p>
            )
          )}
        </div>

        <div className="space-y-4">
          {detail.docs.map((doc) => {
            const src = `/api/admin/kyc/${doc.key}`;
            return (
              <section key={doc.key} className="space-y-2 rounded-xl border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3>{doc.label}</h3>
                  <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    Open <ExternalLink className="size-4" />
                  </a>
                </div>
                {isPdf(doc.key) ? (
                  <p className="text-sm text-muted-foreground">This is a PDF. Use Open to read it.</p>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={doc.label} className="max-h-[32rem] w-full rounded-lg bg-muted object-contain" />
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
