import { cn } from "@/lib/utils";

import type { BarItem } from "./model/chart.type";
import { formatValue } from "./utils/chart.utils";

interface FunnelChartProps {
  /** Stages in order, biggest first (e.g. views, clicks, saves). */
  stages: BarItem[];
  label: string;
  className?: string;
}

/** Shows how many people make it from each step to the next. */
export function FunnelChart({ stages, label, className }: FunnelChartProps) {
  const top = Math.max(stages[0]?.value ?? 0, 1);

  return (
    <ol aria-label={label} className={cn("space-y-3", className)}>
      {stages.map((stage, i) => {
        const previous = i === 0 ? null : stages[i - 1].value;
        const conversion = previous ? (stage.value / previous) * 100 : null;
        return (
          <li key={stage.id} className="space-y-1">
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span>{stage.label}</span>
              <span className="tabular-nums">
                <span className="font-semibold">
                  {formatValue(stage.value, "number")}
                </span>
                {conversion !== null && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {conversion.toFixed(1)}% of previous
                  </span>
                )}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${(stage.value / top) * 100}%`,
                  opacity: 1 - i * 0.22,
                }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
