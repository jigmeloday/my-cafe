import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

const withBusiness = {
  business: { select: { id: true, name: true, slug: true, town: true, dzongkhag: true, logoKey: true, hours: true, phone: true, website: true, addressLine1: true, addressLine2: true, postalCode: true, status: true } },
  category: { select: { name: true } },
} satisfies Prisma.PromotionInclude;

export type LivePromotion = Prisma.PromotionGetPayload<{ include: typeof withBusiness }>;

/**
 * What visitors may see: published, not yet ended, from a business that isn't suspended.
 * `today` is a Bhutan date at midnight UTC (dates are stored without a time).
 */
export const livePromotionWhere = (today: Date): Prisma.PromotionWhereInput => ({
  status: "PUBLISHED",
  removedAt: null,
  OR: [{ endsAt: null }, { endsAt: { gte: today } }],
  business: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } },
});

export const discoveryRepository = {
  /** Every address a search engine may list: live promotions and visible businesses. */
  async sitemapRows(today: Date) {
    const [promotions, businesses] = await Promise.all([
      db.promotion.findMany({ where: livePromotionWhere(today), select: { slug: true, type: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 5000 }),
      db.business.findMany({ where: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } }, select: { slug: true, updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 5000 }),
    ]);
    return { promotions, businesses };
  },

  livePromotions: (today: Date, extra: Prisma.PromotionWhereInput, take: number, orderBy: Prisma.PromotionOrderByWithRelationInput[]) =>
    db.promotion.findMany({ where: { AND: [livePromotionWhere(today), extra] }, relationLoadStrategy: "join", include: withBusiness, orderBy, take }),

  /** Live promotions that are featured today. All of them: the caller shuffles and takes as many as fit. */
  featuredToday: (today: Date) =>
    db.promotion.findMany({
      where: { AND: [livePromotionWhere(today), { featuredBookings: { some: { startsAt: { lte: today }, endsAt: { gte: today } } } }] },
      relationLoadStrategy: "join", include: withBusiness,
    }),

  findLiveBySlug: (today: Date, slug: string) =>
    db.promotion.findFirst({ where: { AND: [livePromotionWhere(today), { slug }] }, relationLoadStrategy: "join", include: withBusiness }),

  /** Clicks per promotion since a moment, to rank "popular". Covers every promotion, so it can run beside the list it ranks. */
  async clicksSince(since: Date) {
    const rows = await db.promotionEvent.groupBy({
      by: ["promotionId"],
      where: { type: "CLICK", createdAt: { gte: since } },
      _count: { _all: true },
    });
    return new Map(rows.map((r) => [r.promotionId, r._count._all]));
  },

  /** One promotion of this owner's business, whatever its status, so they can preview drafts too. */
  findOwnedBySlug: (ownerId: string, slug: string) =>
    db.promotion.findFirst({ where: { slug, business: { ownerId } }, relationLoadStrategy: "join", include: withBusiness }),

  /** The owner's other promotions that visitors can see (published or ended), newest first. */
  ownedOthers: (ownerId: string, excludeId: string, take: number) =>
    db.promotion.findMany({
      where: { id: { not: excludeId }, status: { in: ["PUBLISHED", "ENDED"] }, business: { ownerId } },
      relationLoadStrategy: "join", include: withBusiness,
      orderBy: [{ createdAt: "desc" }],
      take,
    }),

  /** Every published or ended promotion of one business (drafts are private), newest first. */
  forBusiness: (businessId: string) =>
    db.promotion.findMany({
      where: { businessId, status: { in: ["PUBLISHED", "ENDED"] }, removedAt: null },
      relationLoadStrategy: "join", include: withBusiness,
      orderBy: [{ createdAt: "desc" }],
    }),

  /** Businesses for the New places page, each with the categories of its promotions (to work out what it is). */
  businessesWithCategories: (take: number) =>
    db.business.findMany({
      where: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true, name: true, slug: true, tagline: true, town: true, dzongkhag: true, logoKey: true, coverKey: true, createdAt: true,
        promotions: { where: { status: "PUBLISHED" }, select: { category: { select: { name: true } } } },
      },
    }),

  /** Totals for the About page: what visitors can actually find on Nook today. */
  async siteCounts(today: Date) {
    const live = livePromotionWhere(today);
    const [businesses, verified, deals, events] = await Promise.all([
      db.business.count({ where: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } } }),
      db.business.count({ where: { status: "VERIFIED", owner: { status: "ACTIVE" } } }),
      db.promotion.count({ where: { AND: [live, { type: { not: "EVENT" } }] } }),
      db.promotion.count({ where: { AND: [live, { type: "EVENT" }] } }),
    ]);
    return { businesses, verified, deals, events };
  },

  /** Where businesses are: each visible business's town, area and the categories of its live promotions. */
  businessAreas: () =>
    db.business.findMany({
      where: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } },
      select: { town: true, dzongkhag: true, promotions: { where: { status: "PUBLISHED", removedAt: null }, select: { category: { select: { name: true } } } } },
      take: 2000,
    }),

  /** Promotions a person saved, by page slug. Ended ones are kept (so a saved offer doesn't just vanish); removed ones and suspended businesses are not. */
  promotionsBySlugs: (slugs: string[]) =>
    slugs.length === 0
      ? Promise.resolve([])
      : db.promotion.findMany({
          where: { slug: { in: slugs }, status: { in: ["PUBLISHED", "ENDED"] }, removedAt: null, business: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } } },
          relationLoadStrategy: "join", include: withBusiness,
        }),

  /** Businesses a person follows, by page slug. */
  businessesBySlugs: (slugs: string[]) =>
    slugs.length === 0
      ? Promise.resolve([])
      : db.business.findMany({
          where: { slug: { in: slugs }, status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } },
          select: { slug: true, name: true, tagline: true, town: true, dzongkhag: true, logoKey: true },
        }),

  /** Every category with how many live promotions it has right now. */
  categoriesWithCounts: (today: Date) =>
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, _count: { select: { promotions: { where: livePromotionWhere(today) } } } },
    }),

  findCategoryBySlug: (slug: string) => db.category.findUnique({ where: { slug }, select: { id: true, name: true, slug: true } }),

  newBusinesses: (take: number) =>
    db.business.findMany({
      where: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } },
      orderBy: { createdAt: "desc" },
      take,
      select: { id: true, name: true, slug: true, tagline: true, town: true, dzongkhag: true, logoKey: true, coverKey: true },
    }),
};
