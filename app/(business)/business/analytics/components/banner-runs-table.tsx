import { StatusBadge } from "@/components/shared/status-badge";
import {
  formatCoins,
  formatNumber,
  formatPercent,
} from "@/lib/formatters/number";

import type { BannerRunRow } from "../model/analytics.type";
import { addDays } from "../utils/analytics.utils";

const HEADERS = [
  "Promotion",
  "Dates",
  "Status",
  "Impressions",
  "Clicks",
  "CTR",
  "Coins",
  "Coins per click",
];

/** One decimal place without floating-point drift: 1400 coins / 123 clicks -> "11.4". */
const perClick = (coins: number, clicks: number) =>
  clicks === 0 ? "—" : (Math.round((coins * 10) / clicks) / 10).toFixed(1);

export function BannerRunsTable({ rows }: { rows: BannerRunRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[52rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 font-medium ${i >= 3 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {rows.map((run) => (
            <tr key={run.id}>
              <td className="px-4 py-3 font-medium">{run.title}</td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {run.start} → {addDays(run.start, run.days - 1)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge tone={run.active ? "success" : "neutral"}>
                  {run.active ? "Running" : "Ended"}
                </StatusBadge>
              </td>
              <td className="px-4 py-3 text-right">
                {formatNumber(run.impressions)}
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {formatNumber(run.clicks)}
              </td>
              <td className="px-4 py-3 text-right">
                {run.impressions
                  ? formatPercent(run.clicks / run.impressions, 1)
                  : "—"}
              </td>
              <td className="px-4 py-3 text-right">{formatCoins(run.coins)}</td>
              <td className="px-4 py-3 text-right">
                {perClick(run.coins, run.clicks)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
