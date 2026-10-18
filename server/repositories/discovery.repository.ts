import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

const withBusiness = {
  business: { select: { id: true, name: true, slug: true, town: true, dzongkhag: true, logoKey: true, hours: true, phone: true, website: true, addressLine1: true, status: true } },
  category: { select: { name: true } },
} satisfies Prisma.PromotionInclude;

export type LivePromotion = Prisma.PromotionGetPayload<{ include: typeof withBusiness }>;

/**
 * What visitors may see: published, not yet ended, from a business that isn't suspended.
 * `today` is a Bhutan date at midnight UTC (dates are stored without a time).
 */
export const livePromotionWhere = (today: Date): Prisma.PromotionWhereInput => ({
  status: "PUBLISHED",
  OR: [{ endsAt: null }, { endsAt: { gte: today } }],
  business: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } },
});

export const discoveryRepository = {
  livePromotions: (today: Date, extra: Prisma.PromotionWhereInput, take: number, orderBy: Prisma.PromotionOrderByWithRelationInput[]) =>
    db.promotion.findMany({ where: { AND: [livePromotionWhere(today), extra] }, include: withBusiness, orderBy, take }),

  findLiveBySlug: (today: Date, slug: string) =>
    db.promotion.findFirst({ where: { AND: [livePromotionWhere(today), { slug }] }, include: withBusiness }),

  /** Clicks per promotion since a moment, to rank "popular". */
  async clicksSince(promotionIds: string[], since: Date) {
    if (promotionIds.length === 0) return new Map<string, number>();
    const rows = await db.promotionEvent.groupBy({
      by: ["promotionId"],
      where: { promotionId: { in: promotionIds }, type: "CLICK", createdAt: { gte: since } },
      _count: { _all: true },
    });
    return new Map(rows.map((r) => [r.promotionId, r._count._all]));
  },

  /** One promotion of this owner's business, whatever its status, so they can preview drafts too. */
  findOwnedBySlug: (ownerId: string, slug: string) =>
    db.promotion.findFirst({ where: { slug, business: { ownerId } }, include: withBusiness }),

  /** The owner's other promotions that visitors can see (published or ended), newest first. */
  ownedOthers: (ownerId: string, excludeId: string, take: number) =>
    db.promotion.findMany({
      where: { id: { not: excludeId }, status: { in: ["PUBLISHED", "ENDED"] }, business: { ownerId } },
      include: withBusiness,
      orderBy: [{ createdAt: "desc" }],
      take,
    }),

  /** Every published or ended promotion of one business (drafts are private), newest first. */
  forBusiness: (businessId: string) =>
    db.promotion.findMany({
      where: { businessId, status: { in: ["PUBLISHED", "ENDED"] } },
      include: withBusiness,
      orderBy: [{ createdAt: "desc" }],
    }),

  newBusinesses: (take: number) =>
    db.business.findMany({
      where: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } },
      orderBy: { createdAt: "desc" },
      take,
      select: { id: true, name: true, slug: true, tagline: true, town: true, dzongkhag: true, logoKey: true, coverKey: true },
    }),
};
