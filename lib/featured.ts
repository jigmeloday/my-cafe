import { COIN_COSTS } from "@/lib/coins";

/** How many promotions can be featured on the home page on any one day. A full day is sold out. */
export const FEATURED_SLOTS_PER_DAY = 12;
/** How many featured promotions the home page row shows at once. The rest rotate in on every visit. */
export const FEATURED_ROW_SIZE = 6;
/** How many days a feature can run for. "0" means not featured. Strings, so they work as form select values. */
export const FEATURED_DAYS = ["1", "3", "7"] as const;
export const FEATURE_CHOICES = ["0", ...FEATURED_DAYS] as const;
/** How far ahead a feature can be booked. */
export const FEATURED_HORIZON_DAYS = 45;

export const featuredPrice = (days: number) => days * COIN_COSTS.featuredPerDay;

const DAY_MS = 86_400_000;
const addDays = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);

/** The days a feature runs, "YYYY-MM-DD", first and last included. */
export const daysOfRun = (startIso: string, days: number) => Array.from({ length: days }, (_, i) => addDays(startIso, i));

export interface BookedRange {
  /** "YYYY-MM-DD", first and last day included. */
  start: string;
  end: string;
}

/** How many bookings cover each day in `days`. */
export function usageByDay(days: string[], bookings: BookedRange[]): Record<string, number> {
  return Object.fromEntries(days.map((d) => [d, bookings.filter((b) => b.start <= d && b.end >= d).length]));
}

/** The days in a run that already have every place taken. Empty means the whole run is available. */
export function soldOutDays(days: string[], bookings: BookedRange[], capacity = FEATURED_SLOTS_PER_DAY) {
  const usage = usageByDay(days, bookings);
  return days.filter((d) => usage[d] >= capacity);
}

/** Places left on each of the next `count` days from `fromIso`, for showing which days are open. */
export function remainingByDay(fromIso: string, count: number, bookings: BookedRange[], capacity = FEATURED_SLOTS_PER_DAY) {
  const days = daysOfRun(fromIso, count);
  const usage = usageByDay(days, bookings);
  return Object.fromEntries(days.map((d) => [d, Math.max(0, capacity - usage[d])]));
}
