"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormMessage } from "@/components/shared/form-message";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import { formatDate } from "@/lib/formatters/date";
import { formatCoins, formatNumber } from "@/lib/formatters/number";
import type { ActionResult } from "@/server/actions/action.type";
import { takeDownBannerAction } from "@/server/actions/banner.actions";
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.imageUrl}
                        alt=""
                        className="h-11 w-20 shrink-0 rounded-lg bg-muted object-cover"
                      />
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
