import type { BarItem, ChartPoint } from "@/components/business/charts/model/chart.type";
import { CLICK_EVENT_TYPES } from "@/lib/track-events";

import { CLICK_LABELS, OTHER_SOURCE, SOURCES } from "../constant/analytics.constant";
import type { ProfileData, ProfileDay, RangeDays } from "../model/analytics.type";
import { lastDays, sum } from "./analytics.utils";

export interface ProfileEventCount {
  type: string;
  source: string;
  /** "YYYY-MM-DD" */
  day: string;
  count: number;
}

const SOURCE_IDS: string[] = SOURCES.map((s) => s.id);
const lastN = <T>(items: T[], range: RangeDays) => items.slice(-range);

/** Turns counted visits and clicks into per-day series, so any range adds up exactly. Days outside the window are ignored. */
export function buildProfileData(
  endDate: string,
  count: number,
  events: ProfileEventCount[],
  visitors: { day: string; visitors: number }[],
): ProfileData {
  const labels = lastDays(endDate, count);
  const index = new Map(labels.map((d, i) => [d.date, i]));
  const days: ProfileDay[] = labels.map((d) => ({ ...d, visits: 0, visitors: 0, clicks: 0 }));
  const clicks: ProfileData["clicks"] = Object.fromEntries(CLICK_EVENT_TYPES.map((type) => [type, labels.map(() => 0)]));
  const sources: ProfileData["sources"] = Object.fromEntries(SOURCES.map((s) => [s.id, labels.map(() => 0)]));

  for (const e of events) {
    const i = index.get(e.day);
    if (i === undefined) continue;
    if (e.type === "VIEW") {
      days[i].visits += e.count;
      sources[SOURCE_IDS.includes(e.source) ? e.source : OTHER_SOURCE][i] += e.count;
    } else if (clicks[e.type]) {
      days[i].clicks += e.count;
      clicks[e.type][i] += e.count;
    }
  }
  for (const v of visitors) {
    const i = index.get(v.day);
    if (i !== undefined) days[i].visitors = v.visitors;
  }
  return { days, clicks, sources };
}

export const profileTotals = (data: ProfileData, range: RangeDays) => ({
  visits: sum(lastN(data.days, range).map((d) => d.visits)),
  visitors: sum(lastN(data.days, range).map((d) => d.visitors)),
  clicks: sum(lastN(data.days, range).map((d) => d.clicks)),
});

export const previousProfileTotals = (data: ProfileData, range: RangeDays) => {
  const before = data.days.slice(-range * 2, -range);
  return { visits: sum(before.map((d) => d.visits)), visitors: sum(before.map((d) => d.visitors)), clicks: sum(before.map((d) => d.clicks)) };
};

export const profilePoints = (data: ProfileData, range: RangeDays): ChartPoint[] =>
  lastN(data.days, range).map(({ label, visits, visitors, clicks }) => ({ label, values: { visits, visitors, clicks } }));

/** Which link people clicked, biggest first. Kinds nobody clicked are left out. */
export const clickRows = (data: ProfileData, range: RangeDays): BarItem[] =>
  CLICK_EVENT_TYPES.map((type) => ({ id: type, label: CLICK_LABELS[type], value: sum(lastN(data.clicks[type], range)) }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);

export const visitSourceRows = (data: ProfileData, range: RangeDays): BarItem[] =>
  SOURCES.map((s) => ({ id: s.id, label: s.label, value: sum(lastN(data.sources[s.id], range)) }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);
