import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

import { livePromotionWhere } from "./discovery.repository";

export interface DayCount {
  /** Bhutan day, "YYYY-MM-DD". */
  day: string;
  count: number;
}

export interface DayCoins {
  day: string;
  added: number;
  spent: number;
}

/** Counts for the admin Overview. Days are Bhutan days (UTC+6), worked out by the database. */
export const adminOverviewRepository = {
  /** People who signed up, per day. Admins aren't counted: they're staff. */
  async newUsersPerDay(since: Date): Promise<DayCount[]> {
    const rows = await db.$queryRaw<{ day: string; count: bigint }[]>(Prisma.sql`
      select to_char(("createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day, count(*) as count
      from "User" where "createdAt" >= ${since} and role <> 'ADMIN' group by 1`);
    return rows.map((r) => ({ day: r.day, count: Number(r.count) }));
  },

  async newBusinessesPerDay(since: Date): Promise<DayCount[]> {
    const rows = await db.$queryRaw<{ day: string; count: bigint }[]>(Prisma.sql`
      select to_char(("createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day, count(*) as count
      from "Business" where "createdAt" >= ${since} group by 1`);
    return rows.map((r) => ({ day: r.day, count: Number(r.count) }));
  },

  /** Coins that went into wallets (bought or added by an admin) and coins spent, per day. */
  async coinsPerDay(since: Date): Promise<DayCoins[]> {
    const rows = await db.$queryRaw<{ day: string; added: bigint | null; spent: bigint | null }[]>(Prisma.sql`
      select to_char(("createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day,
             sum(case when amount > 0 then amount else 0 end) as added,
             sum(case when amount < 0 then -amount else 0 end) as spent
      from "CoinTransaction" where "createdAt" >= ${since} group by 1`);
    return rows.map((r) => ({ day: r.day, added: Number(r.added ?? 0), spent: Number(r.spent ?? 0) }));
  },

  /** Everything counted in one go. `today` is a Bhutan date at midnight UTC. */
  async totals(today: Date) {
    const [users, businesses, livePromotions, runningBanners, pendingVerifications, suspendedBusinesses, suspendedUsers] = await Promise.all([
      db.user.count({ where: { role: { not: "ADMIN" } } }),
      db.business.count(),
      db.promotion.count({ where: livePromotionWhere(today) }),
      db.banner.count({ where: { removedAt: null, startsAt: { lte: today }, endsAt: { gte: today } } }),
      db.kycSubmission.count({ where: { status: "PENDING" } }),
      db.business.count({ where: { status: "SUSPENDED" } }),
      db.user.count({ where: { status: "SUSPENDED" } }),
    ]);
    return { users, businesses, livePromotions, runningBanners, pendingVerifications, suspendedBusinesses, suspendedUsers, pendingVerifications };
  },

  newestBusinesses: (take: number) =>
    db.business.findMany({
      orderBy: { createdAt: "desc" },
      take,
      select: { id: true, name: true, slug: true, town: true, dzongkhag: true, status: true, createdAt: true },
    }),
};
