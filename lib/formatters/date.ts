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
