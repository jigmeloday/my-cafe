import { formatMoney } from "@/lib/formatters/currency";
import { formatCoins, formatNumber } from "@/lib/formatters/number";

import { PLOT_PAD } from "../constant/chart.constant";
import type { MetricKind } from "../model/chart.type";

export function formatValue(value: number, kind: MetricKind): string {
  if (kind === "money") return formatMoney(value);
  if (kind === "coins") return formatCoins(value);
  if (kind === "permille") return `${(value / 10).toFixed(1)}%`;
  return formatNumber(value);
}

/** Rounds up to a "nice" axis maximum: 37 -> 40, 1337 -> 1500. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const step = 10 ** Math.floor(Math.log10(value)) / 2;
  return Math.ceil(value / step) * step;
}

export const xPercent = (index: number, count: number) =>
  count <= 1 ? 50 : PLOT_PAD + (index / (count - 1)) * (100 - PLOT_PAD * 2);

export const yPercent = (value: number, max: number) =>
  100 - (value / max) * 100;

/** SVG path data in a 0-100 box for the line, and the closed area beneath it. */
export function linePaths(values: number[], max: number) {
  const coords = values.map(
    (v, i) => [xPercent(i, values.length), yPercent(v, max)] as const,
  );
  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const [firstX] = coords[0];
  const [lastX] = coords[coords.length - 1];
  return {
    line,
    area: `${line} L${lastX.toFixed(2)} 100 L${firstX.toFixed(2)} 100 Z`,
  };
}

/** Keeps tooltips inside the plot: left-aligned near the start, right-aligned near the end. */
export function tooltipAlign(
  index: number,
  count: number,
): "start" | "center" | "end" {
  if (index <= 1) return "start";
  if (index >= count - 2) return "end";
  return "center";
}
