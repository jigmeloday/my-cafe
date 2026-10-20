import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters/date";
import { requireRole } from "@/lib/session";
import { kycService } from "@/services/kyc/kyc.service";

export const metadata: Metadata = { title: "Verification — Nook admin" };

const TONE: Record<string, { label: string; tone: StatusTone }> = {
  PENDING: { label: "Waiting", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Sent back", tone: "danger" },
};

export default async function AdminVerificationPage({ searchParams }: PageProps<"/admin/verification">) {
  // The layout also checks this, but a page must not rely on that: it reads private data.
  await requireRole("ADMIN");
  const showAll = (await searchParams).show === "all";
  const items = await kycService.queue(showAll ? "ALL" : "PENDING");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1">
          <h1>Verification</h1>
          <p className="text-sm text-muted-foreground">Businesses that sent their ID and licence to be verified. Oldest first, so nobody waits too long.</p>
        </div>
        <Button variant="secondary" nativeButton={false} render={<Link href={showAll ? "/admin/verification" : "/admin/verification?show=all"} />}>
          {showAll ? "Only waiting" : "Show all requests"}
        </Button>
      </header>
      {items.length === 0 ? (
        <EmptyState title="Nothing to review" description={showAll ? "No one has sent documents yet." : "No requests are waiting."} />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-surface">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Sent</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.businessName}</p>
                    <p className="text-xs text-muted-foreground">{item.ownerName}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDateTime(item.submittedAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={TONE[item.status].tone}>{TONE[item.status].label}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" nativeButton={false} render={<Link href={`/admin/verification/${item.id}`} />}>
                      {item.status === "PENDING" ? "Review" : "View"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
