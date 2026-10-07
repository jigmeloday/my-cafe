import { cn } from "@/lib/utils";

import { CHART_TICKS, LABEL_EVERY } from "../constant/dashboard.constant";
import type { DailyPoint, MetricId } from "../model/dashboard.type";
import {
  formatMetric,
  linePaths,
  niceMax,
  pointValue,
  tooltipAlign,
  xPercent,
  yPercent,
} from "../utils/dashboard.utils";

const TOOLTIP_ALIGN = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

interface ChartLineProps {
  points: DailyPoint[];
  metric: MetricId;
}

export function ChartLine({ points, metric }: ChartLineProps) {
  const values = points.map((p) => pointValue(p, metric));
  const max = niceMax(Math.max(...values));
  const ticks = Array.from(
    { length: CHART_TICKS + 1 },
    (_, i) => (max / CHART_TICKS) * (CHART_TICKS - i),
  );
  const { line, area } = linePaths(values, max);
  const slot = 100 / points.length;

  return (
    <div className="flex gap-3">
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
            {formatMetric(Math.round(t), metric)}
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
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
            aria-hidden
          >
            <path d={area} className="fill-primary/10" />
            <path
              d={line}
              fill="none"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="stroke-primary"
            />
          </svg>
          <ul className="absolute inset-0">
            {points.map((point, i) => {
              const value = values[i];
              const align = tooltipAlign(i, points.length);
              return (
                <li
                  key={point.label}
                  tabIndex={0}
                  aria-label={`${point.label}: ${formatMetric(value, metric)}`}
                  className="group absolute inset-y-0 outline-none"
                  style={{
                    left: `${xPercent(i, points.length) - slot / 2}%`,
                    width: `${slot}%`,
                  }}
                >
                  <span className="absolute inset-y-0 left-1/2 w-px bg-foreground/20 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span
                    className="absolute left-1/2 size-3 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-surface bg-primary opacity-0 shadow group-hover:opacity-100 group-focus-visible:opacity-100"
                    style={{ bottom: `${100 - yPercent(value, max)}%` }}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute top-0 z-10 hidden rounded-lg bg-foreground px-2.5 py-1.5 text-xs whitespace-nowrap text-background shadow-lg group-hover:block group-focus-visible:block",
                      TOOLTIP_ALIGN[align],
                    )}
                  >
                    <span className="block text-background/70">
                      {point.label}
                    </span>
                    <span className="font-semibold">
                      {formatMetric(value, metric)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          className="relative mt-2 h-4 text-xs text-muted-foreground"
          aria-hidden
        >
          {points.map((point, i) =>
            i % LABEL_EVERY === 0 ? (
              <span
                key={point.label}
                className="absolute -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${xPercent(i, points.length)}%` }}
              >
                {point.label}
              </span>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
