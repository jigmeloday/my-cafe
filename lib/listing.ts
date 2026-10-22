import { COIN_COSTS } from "@/lib/coins";

/** The longest a promotion can run in one go. Longer runs are renewed by extending the end date. */
export const MAX_LISTING_DAYS = 90;

const DAY_MS = 86_400_000;
const daysBetween = (fromIso: string, toIso: string) => Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / DAY_MS);

/** Days from `startIso` to `endIso`, both included. A start in the past counts from `todayIso`: days gone by aren't sold. */
export function listingDays(startIso: string, endIso: string, todayIso: string): number {
  const from = startIso > todayIso ? startIso : todayIso;
  return Math.max(0, daysBetween(from, endIso) + 1);
}

/** What going live costs: every day it will run is paid up front. */
export const listingCost = (days: number) => days * COIN_COSTS.publishPerDay;

/** What moving the end date of a live promotion costs: only the new days, nothing back for shortening. */
export const extensionCost = (oldEndIso: string, newEndIso: string) =>
  newEndIso > oldEndIso ? listingCost(daysBetween(oldEndIso, newEndIso)) : 0;
