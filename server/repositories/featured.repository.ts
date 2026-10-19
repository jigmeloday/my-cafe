import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { daysOfRun, FEATURED_SLOTS_PER_DAY, soldOutDays, type BookedRange } from "@/lib/featured";

import { walletRepository } from "./wallet.repository";

type Tx = Prisma.TransactionClient;

/** Some of the chosen days already have every place taken. `days` lists them ("YYYY-MM-DD"). */
export class FeaturedFullError extends Error {
  constructor(public readonly days: string[]) {
    super("Featured places are full");
  }
}

/** The promotion is already booked for some of the chosen days. */
export class FeaturedOverlapError extends Error {
  constructor() {
    super("Already featured on those days");
  }
}

export interface FeaturedRequest {
  /** First day, "YYYY-MM-DD". */
  start: string;
  days: number;
  coins: number;
  /** For the wallet history line. */
  title: string;
  /** Places per day. Only tests change this. */
  capacity?: number;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const asRange = (b: { startsAt: Date; endsAt: Date }): BookedRange => ({ start: iso(b.startsAt), end: iso(b.endsAt) });
/** One number for every booking, so only one booking runs its check at a time. */
const LOCK_KEY = 727_362_001;

export const featuredRepository = {
  /** Bookings that touch any day from `from` to `to` (both "YYYY-MM-DD"). */
  async bookedRanges(from: string, to: string): Promise<BookedRange[]> {
    const rows = await db.featuredBooking.findMany({
      where: { startsAt: { lte: new Date(`${to}T00:00:00Z`) }, endsAt: { gte: new Date(`${from}T00:00:00Z`) } },
      select: { startsAt: true, endsAt: true },
    });
    return rows.map(asRange);
  },

  /** A promotion's own bookings, newest first. */
  forPromotion: (promotionId: string) =>
    db.featuredBooking.findMany({ where: { promotionId }, orderBy: { startsAt: "desc" } }),

  /**
   * Books places and pays for them, inside the caller's transaction. A lock is taken first, so two people
   * booking the last place at the same moment are handled one after the other: the second is told it's full.
   */
  async book(tx: Tx, promotionId: string, businessId: string, req: FeaturedRequest) {
    await tx.$executeRaw(Prisma.sql`select pg_advisory_xact_lock(${LOCK_KEY})`);

    const days = daysOfRun(req.start, req.days);
    const from = new Date(`${days[0]}T00:00:00Z`);
    const to = new Date(`${days[days.length - 1]}T00:00:00Z`);

    const own = await tx.featuredBooking.count({ where: { promotionId, startsAt: { lte: to }, endsAt: { gte: from } } });
    if (own > 0) throw new FeaturedOverlapError();

    const overlapping = await tx.featuredBooking.findMany({ where: { startsAt: { lte: to }, endsAt: { gte: from } }, select: { startsAt: true, endsAt: true } });
    const full = soldOutDays(days, overlapping.map(asRange), req.capacity ?? FEATURED_SLOTS_PER_DAY);
    if (full.length > 0) throw new FeaturedFullError(full);

    await tx.featuredBooking.create({ data: { promotionId, businessId, startsAt: from, endsAt: to, coins: req.coins } });
    await walletRepository.spend(tx, businessId, req.coins, "FEATURED", `Featured on the home page: ${req.title} · ${req.days} ${req.days === 1 ? "day" : "days"}`);
  },
};
