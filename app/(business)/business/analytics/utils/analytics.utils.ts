import type { DayStats, RangeDays, Totals } from "../model/analytics.type";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_MS = 86_400_000;

/** "2026-10-01" plus 2 days -> "2026-10-03". */
export const addDays = (isoDate: string, days: number) =>
  new Date(Date.parse(`${isoDate}T00:00:00Z`) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);

/** The last `count` days ending on `endDate`, oldest first, each with its "5 Oct" label. */
export function lastDays(endDate: string, count: number): { date: string; label: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(endDate, -(count - 1 - i));
    const [, month, day] = date.split("-").map(Number);
    return { date, label: `${day} ${MONTHS[month - 1]}` };
  });
}

export const emptyTotals = (): Totals => ({ views: 0, clicks: 0, saves: 0, shares: 0, chats: 0, reservations: 0 });

export const totalsOf = (
  days: Pick<DayStats, "views" | "clicks" | "saves" | "shares" | "chats" | "reservations">[],
): Totals =>
  days.reduce(
    (t, d) => ({
      views: t.views + d.views,
      clicks: t.clicks + d.clicks,
      saves: t.saves + d.saves,
      shares: t.shares + d.shares,
      chats: t.chats + d.chats,
      reservations: t.reservations + d.reservations,
    }),
    emptyTotals(),
  );

export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** The last `range` items, and the `range` items before them (for comparison). */
export function splitRange<T>(items: T[], range: RangeDays) {
  return {
    current: items.slice(-range),
    previous: items.slice(-range * 2, -range),
  };
}

/** Change vs the previous period as a ratio (0.12 = +12%). Undefined when there is nothing to compare. */
export const change = (now: number, before: number) =>
  before === 0 ? undefined : (now - before) / before;

export const ctr = (t: Pick<Totals, "views" | "clicks">) =>
  t.views === 0 ? 0 : t.clicks / t.views;

/**
 * Splits `total` across weights using whole numbers that add up exactly to `total`
 * (largest-remainder method), so cards, tables and charts never disagree.
 */
export function apportion(total: number, weights: number[]): number[] {
  const weightSum = sum(weights);
  if (weightSum === 0) return weights.map(() => 0);
  const shares = weights.map((w, i) => ({
    i,
    base: Math.floor((total * w) / weightSum),
    rem: (total * w) % weightSum,
  }));
  let left = total - sum(shares.map((s) => s.base));
  [...shares]
    .sort((a, b) => b.rem - a.rem || a.i - b.i)
    .forEach((s) => {
      if (left > 0) {
        s.base += 1;
        left -= 1;
      }
    });
  return shares.map((s) => s.base);
}
