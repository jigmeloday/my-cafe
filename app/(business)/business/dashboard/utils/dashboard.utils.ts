import type { ChartPoint } from "@/components/business/charts/model/chart.type";
import { formatNumber } from "@/lib/formatters/number";

import type { Dataset } from "../../analytics/model/analytics.type";
import { change } from "../../analytics/utils/analytics.utils";
import { previousTotals, rangeTotals, toPoints, rangeDays } from "../../analytics/utils/dataset.utils";
import { FOLLOWER_DAYS, PERFORMANCE_DAYS } from "../constant/dashboard.constant";
import type { SummaryStat } from "../model/dashboard.type";

const RANGE = PERFORMANCE_DAYS as 7 | 14 | 30;

/** Views, clicks and saves for the last days, in the shape the shared chart expects. */
export const performancePoints = (data: Dataset): ChartPoint[] => toPoints(rangeDays(data, RANGE));

interface SummaryInput {
  data: Dataset;
  followers: ChartPoint[];
  live: number;
  total: number;
}

export function getSummary({ data, followers, live, total }: SummaryInput): SummaryStat[] {
  const first = followers[0]?.values.followers ?? 0;
  const last = followers[followers.length - 1]?.values.followers ?? 0;
  const now = rangeTotals(data, RANGE);
  const before = previousTotals(data, RANGE);

  return [
    { label: "Followers", value: formatNumber(last), delta: first === 0 ? undefined : (last - first) / first, hint: `vs ${FOLLOWER_DAYS} days ago` },
    { label: "Live promotions", value: String(live), hint: `${total} in total` },
    { label: "Views", value: formatNumber(now.views), delta: change(now.views, before.views), hint: `last ${PERFORMANCE_DAYS} days` },
    { label: "Clicks", value: formatNumber(now.clicks), delta: change(now.clicks, before.clicks), hint: `last ${PERFORMANCE_DAYS} days` },
  ];
}

/** Clicks per promotion over the dashboard period, to show beside each promotion. */
export function clicksByPromotion(data: Dataset): Record<string, number> {
  return Object.fromEntries(
    Object.entries(data.promotions).map(([id, days]) => [id, days.slice(-PERFORMANCE_DAYS).reduce((sum, d) => sum + d.clicks, 0)]),
  );
}
