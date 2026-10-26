import { db } from "@/lib/db";

/** Thrown inside a transaction when the last seat has just gone, so nothing is saved. */
export class EventFullError extends Error {
  constructor() {
    super("Event is full");
  }
}

const eventSelect = {
  id: true,
  slug: true,
  title: true,
  type: true,
  status: true,
  removedAt: true,
  endsAt: true,
  startsAt: true,
  eventStartsAt: true,
  eventEndsAt: true,
  eventStartTime: true,
  eventEndTime: true,
  location: true,
  registrationEnabled: true,
  registrationLabel: true,
  capacity: true,
  business: { select: { id: true, name: true, ownerId: true, status: true } },
} as const;

export const registrationRepository = {
  /** The event with what registering needs to know. Null when there is no such promotion. */
  eventFor: (promotionId: string) => db.promotion.findUnique({ where: { id: promotionId }, select: eventSelect }),

  /** Seats taken: people registered and not cancelled. */
  taken: (promotionId: string) => db.eventRegistration.count({ where: { promotionId, status: "REGISTERED" } }),

  /** How many times the event's page was opened by someone other than its owner (counted without cookies). */
  views: (promotionId: string) => db.promotionEvent.count({ where: { promotionId, type: "VIEW" } }),

  /** This person's registration for this event, if any. */
  mine: (promotionId: string, userId: string) => db.eventRegistration.findUnique({ where: { promotionId_userId: { promotionId, userId } } }),

  /**
   * Takes a seat. The count and the save are one transaction, so two people can't take the last seat together. A
   * person who cancelled before is simply signed up again.
   */
  register: (input: { promotionId: string; userId: string; name: string; phone: string; capacity: number | null }) =>
    db.$transaction(async (tx) => {
      const existing = await tx.eventRegistration.findUnique({ where: { promotionId_userId: { promotionId: input.promotionId, userId: input.userId } } });
      if (existing?.status === "REGISTERED") return existing;

      if (input.capacity !== null) {
        const taken = await tx.eventRegistration.count({ where: { promotionId: input.promotionId, status: "REGISTERED" } });
        if (taken >= input.capacity) throw new EventFullError();
      }
      const data = { name: input.name, phone: input.phone, status: "REGISTERED" as const, cancelledAt: null, createdAt: new Date() };
      return existing
        ? tx.eventRegistration.update({ where: { id: existing.id }, data })
        : tx.eventRegistration.create({ data: { promotionId: input.promotionId, userId: input.userId, ...data } });
    }),

  /** Gives the seat back, and the name and phone with it: the organiser no longer needs them. False when there was nothing to cancel. */
  async cancel(promotionId: string, userId: string) {
    const { count } = await db.eventRegistration.updateMany({ where: { promotionId, userId, status: "REGISTERED" }, data: { status: "CANCELLED", cancelledAt: new Date(), name: "", phone: "" } });
    return count > 0;
  },

  /** Everyone registered for one event, in the order they signed up. */
  attendees: (promotionId: string) =>
    db.eventRegistration.findMany({ where: { promotionId, status: "REGISTERED" }, orderBy: { createdAt: "asc" }, select: { id: true, name: true, phone: true, createdAt: true } }),

  /** The events a business runs that take reservations (or ever did), with how many are registered. */
  async eventsWithCounts(ownerId: string) {
    const events = await db.promotion.findMany({
      where: { business: { ownerId }, type: "EVENT", removedAt: null, OR: [{ registrationEnabled: true }, { registrations: { some: {} } }] },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, status: true, startsAt: true, endsAt: true, eventStartsAt: true, eventEndsAt: true, capacity: true, registrationEnabled: true },
    });
    const counts = await db.eventRegistration.groupBy({ by: ["promotionId"], where: { promotionId: { in: events.map((e) => e.id) }, status: "REGISTERED" }, _count: { _all: true } });
    const byId = new Map(counts.map((c) => [c.promotionId, c._count._all]));
    return events.map((e) => ({ ...e, registered: byId.get(e.id) ?? 0 }));
  },

  /** An event the owner owns, for the registrations page. */
  ownedEvent: (promotionId: string, ownerId: string) =>
    db.promotion.findFirst({
      where: { id: promotionId, business: { ownerId }, type: "EVENT" },
      select: { id: true, slug: true, title: true, startsAt: true, endsAt: true, eventStartsAt: true, eventEndsAt: true, eventStartTime: true, eventEndTime: true, location: true, capacity: true, registrationEnabled: true },
    }),

  /** The events a person has a seat at, soonest first. */
  forUser: (userId: string) =>
    db.eventRegistration.findMany({
      where: { userId, status: "REGISTERED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        promotion: { select: { id: true, slug: true, title: true, startsAt: true, endsAt: true, eventStartsAt: true, eventEndsAt: true, location: true, status: true, removedAt: true, business: { select: { name: true } } } },
      },
    }),
};
