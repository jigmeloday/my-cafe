import { addDays, lastDays } from "@/app/(business)/business/analytics/utils/analytics.utils";
import { adminOverviewRepository as repo } from "@/server/repositories/admin-overview.repository";
import { reportService } from "@/services/report/report.service";

/** Days of history loaded: the last 30 and the 30 before them, for the change since last period. */
export const OVERVIEW_DAYS = 60;

const BHUTAN = 6 * 3_600_000;
const bhutanDay = (d: Date) => new Date(d.getTime() + BHUTAN).toISOString().slice(0, 10);

export interface OverviewDay {
  /** "5 Oct" */
  label: string;
  users: number;
  businesses: number;
  coinsAdded: number;
  coinsSpent: number;
}

export interface Overview {
  /** Oldest first, OVERVIEW_DAYS long. */
  days: OverviewDay[];
  totals: Awaited<ReturnType<typeof repo.totals>>;
  openReports: number;
  newest: { id: string; name: string; town: string; dzongkhag: string; status: "PENDING" | "VERIFIED" | "SUSPENDED"; joined: string }[];
}

/** Puts counted days onto a full list of days, with zero for days nothing happened. */
export function fillDays(
  endDate: string,
  count: number,
  users: { day: string; count: number }[],
  businesses: { day: string; count: number }[],
  coins: { day: string; added: number; spent: number }[],
): OverviewDay[] {
  const byDay = <T extends { day: string }>(rows: T[]) => new Map(rows.map((r) => [r.day, r]));
  const u = byDay(users);
  const b = byDay(businesses);
  const c = byDay(coins);
  return lastDays(endDate, count).map(({ date, label }) => ({
    label,
    users: u.get(date)?.count ?? 0,
    businesses: b.get(date)?.count ?? 0,
    coinsAdded: c.get(date)?.added ?? 0,
    coinsSpent: c.get(date)?.spent ?? 0,
  }));
}

export const adminOverviewService = {
  async get(now = new Date()): Promise<Overview> {
    const today = bhutanDay(now);
    const startDay = addDays(today, -(OVERVIEW_DAYS - 1));
    // The start of that Bhutan day, as a moment in time.
    const since = new Date(Date.parse(`${startDay}T00:00:00Z`) - BHUTAN);
    const todayDate = new Date(`${today}T00:00:00Z`);

    const [users, businesses, coins, totals, newest, openReports] = await Promise.all([
      repo.newUsersPerDay(since),
      repo.newBusinessesPerDay(since),
      repo.coinsPerDay(since),
      repo.totals(todayDate),
      repo.newestBusinesses(5),
      reportService.list("OPEN"),
    ]);

    return {
      days: fillDays(today, OVERVIEW_DAYS, users, businesses, coins),
      totals,
      openReports: openReports.length,
      newest: newest.map((b) => ({ id: b.id, name: b.name, town: b.town, dzongkhag: b.dzongkhag, status: b.status, joined: bhutanDay(b.createdAt) })),
    };
  },
};
