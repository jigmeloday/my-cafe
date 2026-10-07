import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatNumber, formatPercent } from "@/lib/formatters/number";

import type { PromotionStatsRow } from "../model/analytics.type";
import { ctr } from "../utils/analytics.utils";

const HEADERS = [
  "Promotion",
  "Views",
  "Clicks",
  "CTR",
  "Saves",
  "Share of clicks",
];

export function PromotionsTable({
  rows,
  totalClicks,
}: {
  rows: PromotionStatsRow[];
  totalClicks: number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[42rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 font-medium ${i >= 1 && i <= 4 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {rows.map((row) => {
            const share = totalClicks ? row.clicks / totalClicks : 0;
            return (
              <tr key={row.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/business/promotions/${row.id}/edit`}
                    className="block font-medium hover:underline"
                  >
                    {row.title}
                  </Link>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    {row.type}
                    {row.ended && (
                      <StatusBadge tone="neutral" className="px-2 py-0.5">
                        Ended
                      </StatusBadge>
                    )}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(row.views)}
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatNumber(row.clicks)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatPercent(ctr(row), 1)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(row.saves)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"
                      aria-hidden
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${share * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-xs text-muted-foreground">
                      {formatPercent(share, 0)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
