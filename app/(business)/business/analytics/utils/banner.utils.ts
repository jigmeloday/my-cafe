import type { ChartPoint } from "@/components/business/charts/model/chart.type";

import type { BannerDay, RangeDays } from "../model/analytics.type";
import { lastDays } from "./analytics.utils";

/** Turns counted banner views and clicks into one entry per day. Days outside the window are ignored. */
export function buildBannerData(endDate: string, count: number, events: { type: string; day: string; count: number }[]): BannerDay[] {
  const days: BannerDay[] = lastDays(endDate, count).map((d) => ({ ...d, views: 0, clicks: 0 }));
  const index = new Map(days.map((d, i) => [d.date, i]));
  for (const e of events) {
    const i = index.get(e.day);
    if (i === undefined) continue;
    if (e.type === "VIEW") days[i].views += e.count;
    else days[i].clicks += e.count;
  }
  return days;
}

export const bannerPoints = (days: BannerDay[], range: RangeDays): ChartPoint[] =>
  days.slice(-range).map(({ label, views, clicks }) => ({ label, values: { views, clicks } }));
