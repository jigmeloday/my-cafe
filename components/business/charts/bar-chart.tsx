import { cn } from "@/lib/utils";

import { CHART_TICKS } from "./constant/chart.constant";
import type { BarItem, MetricKind } from "./model/chart.type";
import { formatValue, niceMax } from "./utils/chart.utils";

interface BarChartProps {
  items: BarItem[];
  kind: MetricKind;
  /** Describes the chart for screen readers. */
  label: string;
  className?: string;
}

/** Compares a handful of categories, one bar each (e.g. clicks per promotion). Bars start at zero. */
export function BarChart({ items, kind, label, className }: BarChartProps) {
  const max = niceMax(Math.max(...items.map((i) => i.value), 0));
  const ticks = Array.from(
    { length: CHART_TICKS + 1 },
    (_, i) => (max / CHART_TICKS) * (CHART_TICKS - i),
  );

  return (
    <figure aria-label={label} className={cn("flex gap-3", className)}>
      <div
        className="relative h-52 w-14 shrink-0 text-right text-xs text-muted-foreground tabular-nums"
        aria-hidden
      >
        {ticks.map((t, i) => (
          <span
            key={t}
            className="absolute right-0 -translate-y-1/2"
            style={{ top: `${(i / CHART_TICKS) * 100}%` }}
          >
            {formatValue(Math.round(t), kind)}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative h-52">
          <div
            className="absolute inset-0 flex flex-col justify-between"
            aria-hidden
          >
            {ticks.map((t, i) => (
              <span
                key={t}
                className={cn(
                  "border-t",
                  i === ticks.length - 1
                    ? "border-border"
                    : "border-dashed border-border/70",
                )}
              />
            ))}
          </div>
          <ul className="relative flex h-full items-end">
            {items.map((item) => (
              <li
                key={item.id}
                tabIndex={0}
                aria-label={`${item.label}: ${formatValue(item.value, kind)}`}
                className="group relative flex h-full flex-1 items-end justify-center outline-none"
              >
                <span
                  className="relative w-3/5 max-w-10 rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-80 group-focus-visible:opacity-80"
                  style={{ height: `${(item.value / max) * 100}%` }}
                />
                <span
                  className="pointer-events-none absolute left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-xs whitespace-nowrap text-background shadow-lg group-hover:block group-focus-visible:block"
                  style={{ bottom: `${(item.value / max) * 100}%` }}
                >
                  <span className="block max-w-48 truncate text-background/70">
                    {item.label}
                  </span>
                  <span className="font-semibold">
                    {formatValue(item.value, kind)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="mt-2 flex text-xs text-muted-foreground" aria-hidden>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex-1 truncate px-0.5 text-center"
              title={item.label}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
