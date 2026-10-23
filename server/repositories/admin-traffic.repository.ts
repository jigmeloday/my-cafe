import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

/** Counts for the admin Visitors page. Days and hours are Bhutan time (UTC+6), worked out by the database. */
export const adminTrafficRepository = {
  /** Pages opened per hour of the day (0 to 23) since `since`. Hours nothing happened in are left out. */
  async visitsByHour(since: Date): Promise<{ hour: number; visits: number }[]> {
    const rows = await db.$queryRaw<{ hour: number; visits: bigint }[]>(Prisma.sql`
      select extract(hour from ("createdAt" + interval '6 hours'))::int as hour, count(*) as visits
      from "SiteVisit" where "createdAt" >= ${since} group by 1`);
    return rows.map((r) => ({ hour: r.hour, visits: Number(r.visits) }));
  },

  /** The businesses whose page was opened most since `since`. Owners looking at their own page aren't counted. */
  async topBusinesses(since: Date, take: number): Promise<{ id: string; name: string; views: number }[]> {
    const rows = await db.businessEvent.groupBy({
      by: ["businessId"],
      where: { type: "VIEW", createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { businessId: "desc" } },
      take,
    });
    const names = await db.business.findMany({ where: { id: { in: rows.map((r) => r.businessId) } }, select: { id: true, name: true } });
    const byId = new Map(names.map((b) => [b.id, b.name]));
    return rows.map((r) => ({ id: r.businessId, name: byId.get(r.businessId) ?? "Removed business", views: r._count._all }));
  },

  /** The promotions opened most since `since`. */
  async topPromotions(since: Date, take: number): Promise<{ id: string; title: string; views: number }[]> {
    const rows = await db.promotionEvent.groupBy({
      by: ["promotionId"],
      where: { type: "VIEW", createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { promotionId: "desc" } },
      take,
    });
    const titles = await db.promotion.findMany({ where: { id: { in: rows.map((r) => r.promotionId) } }, select: { id: true, title: true } });
    const byId = new Map(titles.map((p) => [p.id, p.title]));
    return rows.map((r) => ({ id: r.promotionId, title: byId.get(r.promotionId) ?? "Removed promotion", views: r._count._all }));
  },
};
