/** The "When" choices in the search bar. "" means any time. */
export const WHEN_OPTIONS = [
  { id: "", label: "Any time" },
  { id: "today", label: "Today" },
  { id: "weekend", label: "This weekend" },
  { id: "week", label: "This week" },
] as const;

export type WhenId = (typeof WHEN_OPTIONS)[number]["id"];

export const parseWhen = (value: string | string[] | undefined): WhenId => {
  const text = (Array.isArray(value) ? value[0] : value) ?? "";
  return WHEN_OPTIONS.some((o) => o.id === text) ? (text as WhenId) : "";
};

const DAY_MS = 86_400_000;

/**
 * The first and last day (as dates at midnight UTC) a "When" choice covers, or null for any time.
 * "This weekend" is the coming Saturday and Sunday, or what's left of it if today is already part of it.
 */
export function whenRange(when: WhenId, today: Date): { from: Date; to: Date } | null {
  if (!when) return null;
  if (when === "today") return { from: today, to: today };
  if (when === "week") return { from: today, to: new Date(today.getTime() + 6 * DAY_MS) };
  const day = today.getUTCDay(); // 0 = Sunday
  if (day === 0) return { from: today, to: today };
  if (day === 6) return { from: today, to: new Date(today.getTime() + DAY_MS) };
  const saturday = new Date(today.getTime() + (6 - day) * DAY_MS);
  return { from: saturday, to: new Date(saturday.getTime() + DAY_MS) };
}

/** Does something that runs from `startsAt` to `endsAt` (either may be missing) overlap the range? */
export function overlaps(startsAt: Date | null, endsAt: Date | null, range: { from: Date; to: Date } | null): boolean {
  if (!range) return true;
  if (startsAt && startsAt > range.to) return false;
  if (endsAt && endsAt < range.from) return false;
  return true;
}
