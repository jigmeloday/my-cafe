import {
  formatCompact,
  formatNumber,
  formatPercent,
} from "@/lib/formatters/number";
import { formatMoney } from "@/lib/formatters/currency";

import type {
  CampaignRow,
  DailyPoint,
  MetricId,
  SummaryStat,
} from "../model/dashboard.type";

const sum = (
  points: DailyPoint[],
  key: "impressions" | "clicks" | "spendMinor",
) => points.reduce((total, p) => total + p[key], 0);

export const pointValue = (point: DailyPoint, metric: MetricId) =>
  metric === "spend" ? point.spendMinor : point[metric];

export const formatMetric = (value: number, metric: MetricId) =>
  metric === "spend" ? formatMoney(value) : formatNumber(value);

/** Rounds up to a "nice" axis maximum: 37 -> 40, 1337 -> 1400. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const step = 10 ** Math.floor(Math.log10(value)) / 2;
  return Math.ceil(value / step) * step;
}

export const budgetUsed = (
  c: Pick<CampaignRow, "budgetMinor" | "spentMinor">,
) => (c.budgetMinor === 0 ? 0 : Math.min(1, c.spentMinor / c.budgetMinor));

export const campaignCtr = (c: Pick<CampaignRow, "impressions" | "clicks">) =>
  c.impressions === 0 ? 0 : c.clicks / c.impressions;

export function getSummary(points: DailyPoint[]): SummaryStat[] {
  const impressions = sum(points, "impressions");
  const clicks = sum(points, "clicks");
  const spend = sum(points, "spendMinor");

  return [
    {
      label: "Impressions",
      value: formatCompact(impressions),
      delta: 0.124,
      hint: "vs previous 14 days",
    },
    {
      label: "Clicks",
      value: formatNumber(clicks),
      delta: 0.082,
      hint: "vs previous 14 days",
    },
    {
      label: "Click-through rate",
      value: formatPercent(impressions ? clicks / impressions : 0),
      delta: -0.031,
      hint: "vs previous 14 days",
    },
    {
      label: "Spend",
      value: formatMoney(spend),
      delta: 0.082,
      hint: `${formatMoney(clicks ? Math.round(spend / clicks) : 0)} avg. per click`,
    },
  ];
}

/** Horizontal padding (in % of the plot) so the first/last points aren't clipped. */
export const PLOT_PAD = 3;

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
