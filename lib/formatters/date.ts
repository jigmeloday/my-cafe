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

/**
 * "2026-10-06T10:00" -> "6 Oct, 10:00 am". Built by hand, not with toLocaleString, so the server
 * and the browser always produce identical text (avoiding hydration mismatches).
 */
export function formatDateTime(local: string): string {
  if (!local) return "—";
  const [date, time = ""] = local.split("T");
  const [, month, day] = date.split("-").map(Number);
  const label = `${day} ${MONTHS[month - 1]}`;
  if (!time) return label;

  const [hour, minute] = time.split(":").map(Number);
  return `${label}, ${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "pm" : "am"}`;
}

/** "2026-09-12" -> "12 Sep 2026". Built by hand for the same reason as formatDateTime. */
export function formatDate(isoDate: string): string {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("T")[0].split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-10-17" -> a Date at local midnight (not UTC, so the day never shifts). */
export function parseIsoDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getMonth() === month - 1 ? date : undefined;
}

/** A Date -> "2026-10-17" using the local calendar day. */
export const toIsoDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Today's date in the visitor's own time zone, as "YYYY-MM-DD". */
export const todayIso = () => toIsoDate(new Date());
