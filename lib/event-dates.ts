/** What an event row holds about time: the days it is listed on Nook, and (on newer events) the event's own days and times. */
export interface EventDated {
  startsAt: Date | null;
  endsAt: Date | null;
  eventStartsAt: Date | null;
  eventEndsAt: Date | null;
  eventStartTime: string;
  eventEndTime: string;
}

/**
 * The days the event itself happens. Newer events say so themselves (no end day means a one-day event); older ones
 * never did, so their listing days stand in.
 */
export function eventWindow(p: Pick<EventDated, "startsAt" | "endsAt" | "eventStartsAt" | "eventEndsAt">): { start: Date | null; end: Date | null } {
  if (p.eventStartsAt) return { start: p.eventStartsAt, end: p.eventEndsAt ?? p.eventStartsAt };
  return { start: p.startsAt, end: p.endsAt };
}

/** "09:00" -> "9:00 am". */
export function clockLabel(value: string): string {
  const [h = 0, m = 0] = value.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

/** "10:00 am – 4:00 pm", "From 10:00 am", or empty when no time was given. */
export function timeRangeText(start: string, end: string): string {
  if (start && end) return `${clockLabel(start)} – ${clockLabel(end)}`;
  if (start) return `From ${clockLabel(start)}`;
  if (end) return `Until ${clockLabel(end)}`;
  return "";
}

/** "2026-11-01" and "10:00" -> "2026-11-01T10:00:00+06:00" (Bhutan time), for search engines. Just the day without a time. */
export function isoWithTime(day: string, time: string): string {
  return time ? `${day}T${time}:00+06:00` : day;
}
