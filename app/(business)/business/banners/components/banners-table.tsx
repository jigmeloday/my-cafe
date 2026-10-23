import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Photo } from "@/components/shared/photo";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCoins, formatNumber, formatPercent } from "@/lib/formatters/number";
import { formatDate } from "@/lib/formatters/date";
import type { BannerRow } from "@/services/banner/banner.service";

import { BANNERS_COPY, STATUS_LABELS, STATUS_TONES } from "../constant/banner.constant";
import { BannerRowActions } from "./banner-row-actions";

const HEADERS = ["Banner", "Status", "Runs", "Paid", "Views", "Clicks", "CTR", ""];

export function BannersTable({ items }: { items: BannerRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[48rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th key={h} className={`px-4 py-3 font-medium ${i >= 4 ? "text-right" : ""}`}>
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
                    <ImagePlaceholder label="" className="h-11 w-20 shrink-0 rounded-lg" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium">{b.title}</p>
                    {b.description && <p className="truncate text-xs text-muted-foreground">{b.description}</p>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                {b.removed ? (
                  <StatusBadge tone="danger">{BANNERS_COPY.removedByNook}</StatusBadge>
                ) : (
                  <StatusBadge tone={STATUS_TONES[b.status]}>{STATUS_LABELS[b.status]}</StatusBadge>
                )}
                {b.status === "pending" && <p className="mt-1 max-w-48 text-xs whitespace-normal text-muted-foreground">{BANNERS_COPY.reviewWaiting}</p>}
                {b.status === "rejected" && b.reviewNote && <p className="mt-1 max-w-48 text-xs whitespace-normal text-destructive">{b.reviewNote}</p>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDate(b.startDate)} – {formatDate(b.endDate)}
                <span className="block text-xs">{b.days} days</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{formatCoins(b.coins)}</td>
              <td className="px-4 py-3 text-right">{formatNumber(b.views)}</td>
              <td className="px-4 py-3 text-right">{formatNumber(b.clicks)}</td>
              <td className="px-4 py-3 text-right">{b.views ? formatPercent(b.clicks / b.views, 1) : "—"}</td>
              <td className="px-4 py-3 text-right">
                <BannerRowActions banner={b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
