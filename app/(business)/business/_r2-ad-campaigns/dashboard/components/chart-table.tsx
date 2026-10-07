import { formatMoney } from "@/lib/formatters/currency";
import { formatNumber } from "@/lib/formatters/number";

import type { DailyPoint } from "../model/dashboard.type";

export function ChartTable({ points }: { points: DailyPoint[] }) {
  return (
    <div className="max-h-72 overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 text-right font-medium">Impressions</th>
            <th className="px-3 py-2 text-right font-medium">Clicks</th>
            <th className="px-3 py-2 text-right font-medium">Spend</th>
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {points.map((p) => (
            <tr key={p.label}>
              <td className="px-3 py-2">{p.label}</td>
              <td className="px-3 py-2 text-right">
                {formatNumber(p.impressions)}
              </td>
              <td className="px-3 py-2 text-right">{formatNumber(p.clicks)}</td>
              <td className="px-3 py-2 text-right">
                {formatMoney(p.spendMinor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
