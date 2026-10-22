import { cn } from "@/lib/utils";

import type { BarItem } from "./model/chart.type";
import { formatValue } from "./utils/chart.utils";

interface PieChartProps {
  /** The parts of the whole. Each gets the next chart colour. */
  slices: BarItem[];
  label: string;
  /** Small text under the total in the middle, e.g. "accounts". */
  totalLabel?: string;
  className?: string;
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
/** A circle of this radius is 100 long, so a slice's length is just its percentage. */
const RADIUS = 15.915;

/** A ring chart: how a total splits into parts, with a legend that gives the exact numbers. */
export function PieChart({ slices, label, totalLabel, className }: PieChartProps) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let offset = 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      <div className="relative size-36 shrink-0">
        <svg viewBox="-2 -2 40 40" role="img" aria-label={`${label}: ${slices.map((s) => `${s.label} ${s.value}`).join(", ")}`} className="size-full -rotate-90">
          <circle cx="18" cy="18" r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth="6" />
          {total > 0 &&
            slices.map((slice, i) => {
              const length = (slice.value / total) * 100;
              const start = offset;
              offset += length;
              return (
                <circle
                  key={slice.id}
                  cx="18"
                  cy="18"
                  r={RADIUS}
                  fill="none"
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth="6"
                  strokeDasharray={`${length} ${100 - length}`}
                  strokeDashoffset={-start}
                />
              );
            })}
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className="text-2xl font-semibold tabular-nums">{formatValue(total, "number")}</span>
          {totalLabel && <span className="text-xs text-muted-foreground">{totalLabel}</span>}
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2 text-sm">
        {slices.map((slice, i) => (
          <li key={slice.id} className="flex items-center gap-2">
            <span aria-hidden className="size-3 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="truncate">{slice.label}</span>
            <span className="ml-auto shrink-0 tabular-nums text-muted-foreground">
              <span className="font-semibold text-foreground">{formatValue(slice.value, "number")}</span>
              {total > 0 && ` · ${Math.round((slice.value / total) * 100)}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
