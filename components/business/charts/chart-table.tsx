import { CHART_COPY } from "./constant/chart.constant";
import type { ChartMetric, ChartPoint } from "./model/chart.type";
import { formatValue } from "./utils/chart.utils";

interface ChartTableProps {
  points: ChartPoint[];
  metrics: ChartMetric[];
}

export function ChartTable({ points, metrics }: ChartTableProps) {
  return (
    <div className="max-h-72 overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">{CHART_COPY.date}</th>
            {metrics.map((m) => (
              <th key={m.id} className="px-3 py-2 text-right font-medium">
                {m.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {points.map((p) => (
            <tr key={p.label}>
              <td className="px-3 py-2">{p.label}</td>
              {metrics.map((m) => (
                <td key={m.id} className="px-3 py-2 text-right">
                  {formatValue(p.values[m.id] ?? 0, m.kind)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
