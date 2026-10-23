"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { FormMessage } from "@/components/shared/form-message";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Photo } from "@/components/shared/photo";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import { formatDate } from "@/lib/formatters/date";
import { formatCoins, formatNumber } from "@/lib/formatters/number";
import type { ActionResult } from "@/server/actions/action.type";
import { reviewBannerAction, takeDownBannerAction } from "@/server/actions/banner.actions";
import type { BannerRow } from "@/services/banner/banner.service";

import {
  STATUS_LABELS,
  STATUS_TONES,
} from "@/app/(business)/business/banners/constant/banner.constant";

const HEADERS = [
  "Banner",
  "Business",
  "Status",
  "Runs",
  "Paid",
  "Views",
  "Clicks",
  "",
];

export function AdminBannersTable({ items }: { items: BannerRow[] }) {
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const [target, setTarget] = useState<BannerRow | null>(null);
  const [approve, setApprove] = useState<BannerRow | null>(null);
  const [reject, setReject] = useState<BannerRow | null>(null);
  const { run, pending } = useActionRunner(setNotice);

  return (
    <div className="space-y-3">
      {notice && (
        <FormMessage tone={notice.ok ? "success" : "error"}>
          {notice.ok ? (notice.message ?? "Done.") : notice.error}
        </FormMessage>
      )}
      <div className="overflow-x-auto rounded-xl border bg-surface">
        <table className="w-full min-w-[56rem] text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b">
              {HEADERS.map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3 font-medium ${i >= 5 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y tabular-nums">
            {items.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {b.imageUrl ? (
                      <Photo src={b.imageUrl} sizes="80px" className="h-11 w-20 shrink-0 rounded-lg" />
                    ) : (
                      <ImagePlaceholder
                        label=""
                        className="h-11 w-20 shrink-0 rounded-lg"
                      />
                    )}
                    <p className="min-w-0 truncate font-medium">{b.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{b.businessName}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={STATUS_TONES[b.status]}>
                    {STATUS_LABELS[b.status]}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {formatDate(b.startDate)} – {formatDate(b.endDate)}
                  <span className="block text-xs">{b.days} days</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {b.coins === 0 ? "Free (admin)" : formatCoins(b.coins)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(b.views)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(b.clicks)}
                </td>
                <td className="px-4 py-3 text-right">
                  {b.status === "pending" && (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" disabled={pending} onClick={() => setApprove(b)}>
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm" disabled={pending} onClick={() => setReject(b)}>
                      Reject
                    </Button>
                  </div>
                )}
                {(b.status === "active" || b.status === "scheduled") && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={pending}
                      onClick={() => setTarget(b)}
                    >
                      Take down
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={approve !== null}
        onOpenChange={(open) => !open && setApprove(null)}
        title="Approve this banner?"
        description={`“${approve?.title}” for ${approve?.businessName} will show on the home page on its days, and its owner will be told.`}
        confirmLabel="Approve"
        cancelLabel="Not yet"
        onConfirm={() => approve && run(reviewBannerAction, { id: approve.id, decision: "APPROVED" })}
      />
      <ReasonDialog
        open={reject !== null}
        onOpenChange={(open) => !open && setReject(null)}
        title="Turn this banner down?"
        description={
          reject && reject.refundable > 0
            ? `“${reject.title}” won't be shown. The ${reject.refundable.toLocaleString("en")} coins the business paid are given back, and it sees your reason.`
            : `“${reject?.title}” won't be shown and the business sees your reason. It was approved and shown before this edit, so its coins are not refunded.`
        }
        label="Reason (shown to the business)"
        confirmLabel={reject && reject.refundable > 0 ? "Reject and refund" : "Reject"}
        minLength={5}
        onConfirm={(note) => reject && run(reviewBannerAction, { id: reject.id, decision: "REJECTED", note })}
      />
      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Take this banner down?"
        description={`“${target?.title}” for ${target?.businessName} will stop showing on the home page right away, and its owner will be told. This can't be undone.`}
        confirmLabel="Take down"
        cancelLabel="Keep it"
        onConfirm={() => target && run(takeDownBannerAction, target.id)}
      />
    </div>
  );
}
