import { cn } from "@/lib/utils";

import type { BarItem, MetricKind } from "./model/chart.type";
import { formatValue } from "./utils/chart.utils";

interface BreakdownListProps {
  rows: BarItem[];
  kind?: MetricKind;
  /** Tailwind class for the bar colour. */
  barClassName?: string;
  /** Show each row's share of the total next to its value. */
  showShare?: boolean;
  className?: string;
}

/** A ranked list with a proportional bar per row (e.g. where clicks come from). */
export function BreakdownList({
  rows,
  kind = "number",
  barClassName = "bg-primary",
  showShare = true,
  className,
}: BreakdownListProps) {
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className={cn("space-y-3", className)}>
      {rows.map(({ id, label, value }) => (
        <li key={id} className="space-y-1">
          <div className="flex justify-between gap-4 text-sm">
            <span className="truncate">{label}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              <span className="font-semibold text-foreground">
                {formatValue(value, kind)}
              </span>
              {showShare &&
                total > 0 &&
                ` · ${Math.round((value / total) * 100)}%`}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", barClassName)}
              style={{ width: `${(value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
