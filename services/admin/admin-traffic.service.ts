import { addDays, lastDays } from "@/app/(business)/business/analytics/utils/analytics.utils";
import { adminOverviewRepository as overview } from "@/server/repositories/admin-overview.repository";
import { adminTrafficRepository as repo } from "@/server/repositories/admin-traffic.repository";

const BHUTAN = 6 * 3_600_000;
const TOP_COUNT = 5;
const bhutanDay = (d: Date) => new Date(d.getTime() + BHUTAN).toISOString().slice(0, 10);
/** The start of a Bhutan day, as a moment in time. */
const startOfDay = (day: string) => new Date(Date.parse(`${day}T00:00:00Z`) - BHUTAN);

export interface VisitorDay {
  /** "YYYY-MM-DD" */
  date: string;
  /** "5 Oct" */
  label: string;
  visits: number;
  visitors: number;
}

export interface VisitorsReport {
  rangeDays: number;
  /** Oldest first: the range, and the same number of days before it for comparison. */
  days: VisitorDay[];
  /** Pages opened per part of the site in the range, most visited first. */
  sections: { section: string; visits: number }[];
  /** Pages opened per hour of the day (24 entries, 0 to 23) in the range. */
  hours: number[];
  topBusinesses: { id: string; name: string; views: number }[];
  topPromotions: { id: string; title: string; views: number }[];
}

export const adminTrafficService = {
  /** Visitor numbers for the last `rangeDays` days, and the days before them to compare with. */
  async get(rangeDays: number, now = new Date()): Promise<VisitorsReport> {
    const today = bhutanDay(now);
    const since = startOfDay(addDays(today, -(rangeDays - 1)));
    const sinceWithPrevious = startOfDay(addDays(today, -(rangeDays * 2 - 1)));

    const [perDay, sections, byHour, topBusinesses, topPromotions] = await Promise.all([
      overview.trafficPerDay(sinceWithPrevious),
      overview.trafficBySection(since),
      repo.visitsByHour(since),
      repo.topBusinesses(since, TOP_COUNT),
      repo.topPromotions(since, TOP_COUNT),
    ]);

    const counted = new Map(perDay.map((d) => [d.day, d]));
    const hours = Array.from({ length: 24 }, (_, h) => byHour.find((r) => r.hour === h)?.visits ?? 0);
    return {
      rangeDays,
      days: lastDays(today, rangeDays * 2).map(({ date, label }) => ({ date, label, visits: counted.get(date)?.visits ?? 0, visitors: counted.get(date)?.visitors ?? 0 })),
      sections,
      hours,
      topBusinesses,
      topPromotions,
    };
  },
};
