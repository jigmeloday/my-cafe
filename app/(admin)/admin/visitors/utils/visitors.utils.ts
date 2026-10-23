import type { BarItem, ChartPoint } from "@/components/business/charts/model/chart.type";
import { formatNumber } from "@/lib/formatters/number";
import type { VisitorDay, VisitorsReport } from "@/services/admin/admin-traffic.service";

import { SECTION_LABELS } from "../../dashboard/constant/dashboard.constant";
import { DEFAULT_RANGE_ID, RANGES, WEEKDAYS } from "../constant/visitors.constant";

const sum = (days: VisitorDay[], pick: (d: VisitorDay) => number) => days.reduce((t, d) => t + pick(d), 0);
const change = (now: number, before: number) => (before === 0 ? undefined : (now - before) / before);

/** The range asked for in the address, or the default when it is missing or not one we offer. */
export const parseRange = (value?: string | string[]) => {
  const id = Array.isArray(value) ? value[0] : value;
  return RANGES.find((r) => r.id === id) ?? RANGES.find((r) => r.id === DEFAULT_RANGE_ID)!;
};

/** The days being looked at, and the same number before them. */
export function periods({ days, rangeDays }: Pick<VisitorsReport, "days" | "rangeDays">) {
  return { current: days.slice(-rangeDays), previous: days.slice(0, -rangeDays) };
}

/** The four numbers at the top: today, the range's visitors and pages, and pages per visitor. */
export function visitorStats(report: Pick<VisitorsReport, "days" | "rangeDays">) {
  const { current, previous } = periods(report);
  const today = current.at(-1);
  const yesterday = current.at(-2);
  const visitors = sum(current, (d) => d.visitors);
  const visits = sum(current, (d) => d.visits);
  const label = `last ${report.rangeDays} days`;
  return [
    { label: "Visitors today", value: formatNumber(today?.visitors ?? 0), delta: change(today?.visitors ?? 0, yesterday?.visitors ?? 0), hint: "vs yesterday" },
    { label: "Visitors", value: formatNumber(visitors), delta: change(visitors, sum(previous, (d) => d.visitors)), hint: label },
    { label: "Pages opened", value: formatNumber(visits), delta: change(visits, sum(previous, (d) => d.visits)), hint: label },
    { label: "Pages per visitor", value: visitors === 0 ? "0" : (visits / visitors).toFixed(1), hint: label },
  ];
}

export const visitorPoints = (report: Pick<VisitorsReport, "days" | "rangeDays">): ChartPoint[] =>
  periods(report).current.map((d) => ({ label: d.label, values: { visitors: d.visitors, visits: d.visits } }));

export const sectionRows = (sections: VisitorsReport["sections"]): BarItem[] =>
  sections.map(({ section, visits }) => ({ id: section, label: SECTION_LABELS[section] ?? section, value: visits }));

/** The hour as a short label: 0 -> "12a", 13 -> "1p". */
const hourLabel = (h: number) => `${h % 12 || 12}${h < 12 ? "a" : "p"}`;

/** 24 bars is a lot of labels for the width, so only every third hour is named ("12a", "3a", "6a"...). */
export const hourItems = (hours: number[]): BarItem[] => hours.map((value, h) => ({ id: String(h), label: h % 3 === 0 ? hourLabel(h) : "", value }));

/** Average visitors on each day of the week, Monday first, over the days looked at. */
export function weekdayItems(report: Pick<VisitorsReport, "days" | "rangeDays">): BarItem[] {
  const totals = WEEKDAYS.map(() => ({ visitors: 0, days: 0 }));
  for (const d of periods(report).current) {
    // JS getDay(): 0 = Sunday. Our list starts on Monday.
    const i = (new Date(`${d.date}T00:00:00Z`).getUTCDay() + 6) % 7;
    totals[i].visitors += d.visitors;
    totals[i].days += 1;
  }
  return WEEKDAYS.map((label, i) => ({ id: label, label, value: totals[i].days ? Math.round(totals[i].visitors / totals[i].days) : 0 }));
}
