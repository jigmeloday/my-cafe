import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export interface EventRow {
  promotionId: string;
  type: "VIEW" | "CLICK";
  source: string;
  /** Bhutan-time day, "YYYY-MM-DD". */
  day: string;
  count: number;
}

/** Database access for the business dashboard's numbers. Everything is limited to what the caller passes in. */
export const analyticsRepository = {
  /** Views and clicks per promotion, source and day. Days are Bhutan days (UTC+6), counted by the database. */
  async eventCounts(promotionIds: string[], since: Date): Promise<EventRow[]> {
    if (promotionIds.length === 0) return [];
    const rows = await db.$queryRaw<{ promotionId: string; type: "VIEW" | "CLICK"; source: string; day: string; count: bigint }[]>(Prisma.sql`
      select "promotionId", type::text as type, source,
             to_char(("createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day,
             count(*) as count
      from "PromotionEvent"
      where "promotionId" in (${Prisma.join(promotionIds)}) and "createdAt" >= ${since}
      group by 1, 2, 3, 4`);
    return rows.map((r) => ({ ...r, count: Number(r.count) }));
  },

  /** Hearts on pages whose address ends with one of these slugs ("/promotions/<slug>"). */
  savesSince: (slugs: string[], since: Date) =>
    slugs.length === 0
      ? Promise.resolve([])
      : db.favorite.findMany({
          where: { createdAt: { gte: since }, OR: slugs.map((slug) => ({ href: { endsWith: `/${slug}` } })) },
          select: { href: true, createdAt: true },
        }),

  followersTotal: (href: string) => db.follow.count({ where: { href } }),

  followsSince: (href: string, since: Date) =>
    db.follow.findMany({ where: { href, createdAt: { gte: since } }, select: { createdAt: true } }),

  /** What followers chose to share. Only their saved profile fields are read, never names or emails. */
  followerProfiles: (href: string) =>
    db.follow.findMany({
      where: { href },
      select: { user: { select: { profile: { select: { dzongkhag: true, interests: true, marketingConsent: true } } } } },
    }),

  coinsSpentByType: async (businessId: string) => {
    const rows = await db.coinTransaction.groupBy({
      by: ["type"],
      where: { wallet: { businessId }, amount: { lt: 0 } },
      _sum: { amount: true },
    });
    return rows.map((r) => ({ type: r.type, coins: -(r._sum.amount ?? 0) }));
  },

  publishedPromotions: (businessId: string) =>
    db.promotion.findMany({
      where: { businessId, status: { not: "DRAFT" } },
      select: { id: true, slug: true, title: true, type: true, status: true },
      orderBy: { createdAt: "desc" },
    }),

  recordEvent: (promotionId: string, type: "VIEW" | "CLICK", source: string) =>
    db.promotionEvent.create({ data: { promotionId, type, source } }),

  /** True for a live promotion that the viewer does not own. An owner looking at their own page isn't an audience. */
  isCountable: async (promotionId: string, viewerId: string | null) =>
    (await db.promotion.count({
      where: { id: promotionId, status: "PUBLISHED", ...(viewerId ? { business: { ownerId: { not: viewerId } } } : {}) },
    })) > 0,
};
