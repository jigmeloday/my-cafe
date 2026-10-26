import { lastDays } from "@/app/(business)/business/analytics/utils/analytics.utils";
import { eventWindow, timeRangeText } from "@/lib/event-dates";
import { isValidPhone } from "@/lib/phone";
import type { RegistrationInput } from "@/lib/validations/registration.schema";
import { analyticsRepository } from "@/server/repositories/analytics.repository";
import { EventFullError, registrationRepository as repo } from "@/server/repositories/registration.repository";
import { bhutanToday } from "@/services/discovery/discovery.service";
import { registrationConfirmedEmail } from "@/services/email/registration-templates";
import { sendEmail } from "@/services/email/email.service";

type Result = { ok: true; message?: string } | { ok: false; error: string };
type Event = NonNullable<Awaited<ReturnType<typeof repo.eventFor>>>;

export interface SeatStatus {
  /** The words on the reserve button. */
  label: string;
  /** Seats left, or null when there is no limit. */
  seatsLeft: number | null;
  full: boolean;
  /** This person already has a seat. */
  mine: boolean;
}

/** Whether people can reserve a seat now: a live event with registration on, not over, from a business in good standing. */
function isOpen(event: Event | null, today: Date): event is Event {
  return (
    !!event &&
    event.type === "EVENT" &&
    event.registrationEnabled &&
    event.status === "PUBLISHED" &&
    event.removedAt === null &&
    event.business.status !== "SUSPENDED" &&
    // Open until the event is over (its own last day; for older events, the listing's).
    (eventWindow(event).end === null || eventWindow(event).end! >= today)
  );
}

/** How many days of sign-ups the chart on an event's guest list covers. */
const INSIGHT_DAYS = 30;

const NOT_OPEN = "Registration for this event isn't open.";

/** A value that is safe to put in a spreadsheet cell: one starting with = + - @ would be run as a formula, so it is quoted. */
const csvCell = (value: string) => {
  const safe = /^[=+\-@\t\r]/.test(value) && !isValidPhone(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export const registrationService = {
  /** What the event page shows beside the button. Null when the event doesn't take reservations (so nothing is shown). */
  async seatStatus(promotionId: string, userId: string | null, now = new Date()): Promise<SeatStatus | null> {
    const event = await repo.eventFor(promotionId);
    if (!isOpen(event, bhutanToday(now))) return null;
    const [taken, mine] = await Promise.all([repo.taken(promotionId), userId ? repo.mine(promotionId, userId) : null]);
    const seatsLeft = event.capacity === null ? null : Math.max(0, event.capacity - taken);
    return { label: event.registrationLabel, seatsLeft, full: seatsLeft === 0, mine: mine?.status === "REGISTERED" };
  },

  /** A customer reserves a seat. Their name and phone go to the organiser (they agreed to that on the form). */
  async register(user: { id: string; role: string; email: string }, input: RegistrationInput, now = new Date()): Promise<Result> {
    if (user.role !== "USER") return { ok: false, error: "Only customer accounts can reserve a seat." };
    const event = await repo.eventFor(input.promotionId);
    if (!isOpen(event, bhutanToday(now))) return { ok: false, error: NOT_OPEN };

    try {
      await repo.register({ promotionId: event.id, userId: user.id, name: input.name, phone: input.phone, capacity: event.capacity });
    } catch (error) {
      if (error instanceof EventFullError) return { ok: false, error: "Sorry, every seat has just been taken." };
      throw error;
    }

    // The email is a courtesy: if it can't be sent, the seat is still theirs.
    try {
      await sendEmail({
        to: user.email,
        ...registrationConfirmedEmail({ name: input.name, eventTitle: event.title, businessName: event.business.name, slug: event.slug, startsAt: eventWindow(event).start, endsAt: eventWindow(event).end, time: timeRangeText(event.eventStartTime, event.eventEndTime), location: event.location }),
      });
    } catch (error) {
      console.error("[email] Couldn't send the registration email:", (error as Error).message);
    }
    return { ok: true, message: "You're registered." };
  },

  /** A person gives their seat back. */
  async cancel(userId: string, promotionId: string): Promise<Result> {
    return (await repo.cancel(promotionId, userId)) ? { ok: true, message: "Your registration was cancelled." } : { ok: false, error: "You aren't registered for this event." };
  },

  /** The organiser's view of one event: who has a seat. Null when it isn't theirs. */
  async attendees(ownerId: string, promotionId: string) {
    const event = await repo.ownedEvent(promotionId, ownerId);
    if (!event) return null;
    const rows = await repo.attendees(promotionId);
    return { event, attendees: rows, seatsLeft: event.capacity === null ? null : Math.max(0, event.capacity - rows.length) };
  },

  /** How one event is doing: views, seats reserved, and how many reserved per day over the last 30 days. Null when it isn't theirs. */
  async insights(ownerId: string, promotionId: string, now = new Date()) {
    const event = await repo.ownedEvent(promotionId, ownerId);
    if (!event) return null;

    const today = new Date(now.getTime() + 6 * 3_600_000).toISOString().slice(0, 10);
    const days = lastDays(today, INSIGHT_DAYS);
    const since = new Date(Date.parse(`${days[0].date}T00:00:00Z`) - 6 * 3_600_000);
    const [views, taken, perDay] = await Promise.all([repo.views(promotionId), repo.taken(promotionId), analyticsRepository.reservationCounts([promotionId], since)]);

    const byDay = new Map(perDay.map((r) => [r.day, r.count]));
    return { views, reserved: taken, perDay: days.map(({ date, label }) => ({ label, reservations: byDay.get(date) ?? 0 })) };
  },

  /** The list as a spreadsheet file (CSV), for the organiser to keep or print. */
  async csv(ownerId: string, promotionId: string): Promise<{ filename: string; body: string } | null> {
    const found = await this.attendees(ownerId, promotionId);
    if (!found) return null;
    const rows = [["Name", "Phone", "Registered on"], ...found.attendees.map((a) => [a.name, a.phone, a.createdAt.toISOString().slice(0, 10)])];
    return { filename: `${found.event.slug}-guest-list.csv`, body: `﻿${rows.map((r) => r.map(csvCell).join(",")).join("\r\n")}\r\n` };
  },

  /** Every event a business runs that takes reservations, with how many have signed up. */
  eventsWithCounts: (ownerId: string) => repo.eventsWithCounts(ownerId),

  /** The events a customer has a seat at. */
  myEvents: (userId: string) => repo.forUser(userId),
};
