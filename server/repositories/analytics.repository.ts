import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type { BusinessEventType, PromotionEventKind } from "@/lib/track-events";

export interface EventRow {
  promotionId: string;
  type: PromotionEventKind;
  source: string;
  /** Bhutan-time day, "YYYY-MM-DD". */
  day: string;
  count: number;
}

export interface BusinessEventRow {
  type: BusinessEventType;
  source: string;
  day: string;
  count: number;
}

export interface VisitorDay {
  day: string;
  /** Different people that day: one visitor code is one person, and a code lasts one day. */
  visitors: number;
}

/** Database access for the business dashboard's numbers. Everything is limited to what the caller passes in. */
export const analyticsRepository = {
  /** Views and clicks per promotion, source and day. Days are Bhutan days (UTC+6), counted by the database. */
  async eventCounts(promotionIds: string[], since: Date): Promise<EventRow[]> {
    if (promotionIds.length === 0) return [];
    const rows = await db.$queryRaw<{ promotionId: string; type: PromotionEventKind; source: string; day: string; count: bigint }[]>(Prisma.sql`
      select "promotionId", type::text as type, source,
             to_char(("createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day,
             count(*) as count
      from "PromotionEvent"
      where "promotionId" in (${Prisma.join(promotionIds)}) and "createdAt" >= ${since}
      group by 1, 2, 3, 4`);
    return rows.map((r) => ({ ...r, count: Number(r.count) }));
  },

  /** Visits and contact clicks on a business's page, per kind, source and Bhutan day. */
  async businessEventCounts(businessId: string, since: Date): Promise<BusinessEventRow[]> {
    const rows = await db.$queryRaw<{ type: BusinessEventType; source: string; day: string; count: bigint }[]>(Prisma.sql`
      select type::text as type, source,
             to_char(("createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day,
             count(*) as count
      from "BusinessEvent" where "businessId" = ${businessId} and "createdAt" >= ${since}
      group by 1, 2, 3`);
    return rows.map((r) => ({ ...r, count: Number(r.count) }));
  },

  /** Views and clicks on all of a business's banners, per kind and Bhutan day. */
  async bannerEventCounts(businessId: string, since: Date): Promise<{ type: string; day: string; count: number }[]> {
    const rows = await db.$queryRaw<{ type: string; day: string; count: bigint }[]>(Prisma.sql`
      select e.type::text as type,
             to_char((e."createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day,
             count(*) as count
      from "BannerEvent" e join "Banner" b on b.id = e."bannerId"
      where b."businessId" = ${businessId} and e."createdAt" >= ${since}
      group by 1, 2`);
    return rows.map((r) => ({ ...r, count: Number(r.count) }));
  },

  /** Different people who visited the business's page, per day. */
  async businessVisitorsPerDay(businessId: string, since: Date): Promise<VisitorDay[]> {
    const rows = await db.$queryRaw<{ day: string; visitors: bigint }[]>(Prisma.sql`
      select to_char(("createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day, count(distinct visitor) as visitors
      from "BusinessEvent" where "businessId" = ${businessId} and "createdAt" >= ${since} and visitor <> ''
      group by 1`);
    return rows.map((r) => ({ day: r.day, visitors: Number(r.visitors) }));
  },

  /** Different people who viewed or clicked any of these promotions, per day (a person who saw two counts once). */
  async promotionReachPerDay(promotionIds: string[], since: Date): Promise<VisitorDay[]> {
    if (promotionIds.length === 0) return [];
    const rows = await db.$queryRaw<{ day: string; visitors: bigint }[]>(Prisma.sql`
      select to_char(("createdAt" + interval '6 hours')::date, 'YYYY-MM-DD') as day, count(distinct visitor) as visitors
      from "PromotionEvent"
      where "promotionId" in (${Prisma.join(promotionIds)}) and "createdAt" >= ${since} and visitor <> ''
      group by 1`);
    return rows.map((r) => ({ day: r.day, visitors: Number(r.visitors) }));
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

  recordEvent: (promotionId: string, type: PromotionEventKind, source: string, visitor: string) =>
    db.promotionEvent.create({ data: { promotionId, type, source, visitor } }),

  /** How many times this visitor already did this to this promotion since `since`. */
  recentPromotionEvents: (promotionId: string, type: PromotionEventKind, visitor: string, since: Date) =>
    db.promotionEvent.count({ where: { promotionId, type, visitor, createdAt: { gte: since } } }),

  /** The business behind a public page, unless it's suspended or the viewer owns it. Null means "don't count". */
  countableBusiness: (slug: string, viewerId: string | null) =>
    db.business.findFirst({
      where: { slug, status: { not: "SUSPENDED" }, ...(viewerId ? { ownerId: { not: viewerId } } : {}) },
      select: { id: true },
    }),

  recordBusinessEvent: (businessId: string, type: BusinessEventType, source: string, visitor: string) =>
    db.businessEvent.create({ data: { businessId, type, source, visitor } }),

  recentBusinessEvents: (businessId: string, type: BusinessEventType, visitor: string, since: Date) =>
    db.businessEvent.count({ where: { businessId, type, visitor, createdAt: { gte: since } } }),

  recordSiteVisit: (section: string, visitor: string) => db.siteVisit.create({ data: { section, visitor } }),

  siteVisitsSince: (visitor: string, since: Date) => db.siteVisit.count({ where: { visitor, createdAt: { gte: since } } }),

  /** True for a live promotion that the viewer does not own. An owner looking at their own page isn't an audience. */
  isCountable: async (promotionId: string, viewerId: string | null) =>
    (await db.promotion.count({
      where: { id: promotionId, status: "PUBLISHED", ...(viewerId ? { business: { ownerId: { not: viewerId } } } : {}) },
    })) > 0,
};
