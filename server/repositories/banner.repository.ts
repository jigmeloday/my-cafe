import { db } from "@/lib/db";

import { walletRepository } from "./wallet.repository";

const withBusiness = { business: { select: { id: true, name: true, slug: true } }, promotion: { select: { slug: true, status: true } } } as const;

export const bannerRepository = {
  listByOwner: (ownerId: string) =>
    db.banner.findMany({ where: { business: { ownerId } }, orderBy: { createdAt: "desc" }, relationLoadStrategy: "join", include: withBusiness }),

  /** Views and clicks per banner. */
  async eventTotals(bannerIds: string[]) {
    if (bannerIds.length === 0) return new Map<string, { views: number; clicks: number }>();
    const rows = await db.bannerEvent.groupBy({ by: ["bannerId", "type"], where: { bannerId: { in: bannerIds } }, _count: { _all: true } });
    const totals = new Map<string, { views: number; clicks: number }>();
    for (const r of rows) {
      const t = totals.get(r.bannerId) ?? { views: 0, clicks: 0 };
      if (r.type === "VIEW") t.views = r._count._all;
      else t.clicks = r._count._all;
      totals.set(r.bannerId, t);
    }
    return totals;
  },

  /** Banners showing on `today`: started, not ended, from a business and owner that aren't suspended. */
  active: (today: Date) =>
    db.banner.findMany({
      where: { removedAt: null, startsAt: { lte: today }, endsAt: { gte: today }, business: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } } },
      orderBy: { createdAt: "desc" },
      relationLoadStrategy: "join", include: withBusiness,
    }),

  /** Saves the banner and takes its price from the wallet in one transaction: both happen, or neither. */
  create: (data: { businessId: string; promotionId: string | null; title: string; description: string; imageKey: string; startsAt: Date; endsAt: Date; coins: number }) =>
    db.$transaction(async (tx) => {
      const banner = await tx.banner.create({ data });
      await walletRepository.spend(tx, data.businessId, data.coins, "BANNER", `Homepage banner: ${data.title}`);
      return banner;
    }),

  /** One of the owner's banners with its business, or null. */
  findOwned: (id: string, ownerId: string) =>
    db.banner.findFirst({ where: { id, business: { ownerId } }, include: { business: { select: { id: true, name: true, status: true } } } }),

  /**
   * Saves the changes to a banner, takes the price of any added days from the wallet, and records the edit, all in
   * one transaction. `paid` is the extra coins, added to what the banner has cost in total.
   */
  update: (
    id: string,
    businessId: string,
    data: { title: string; description: string; imageKey: string; endsAt: Date },
    paid: number,
    audit: { actorId: string; actorEmail: string; action: string; targetId: string; targetLabel: string },
  ) =>
    db.$transaction(async (tx) => {
      await tx.banner.update({ where: { id }, data: { ...data, ...(paid > 0 ? { coins: { increment: paid } } : {}) } });
      if (paid > 0) await walletRepository.spend(tx, businessId, paid, "BANNER", `Extended banner: ${data.title}`);
      await tx.auditLog.create({ data: audit });
    }),

  /** How many reports have been sent about a banner. */
  reportCount: (bannerId: string) => db.report.count({ where: { bannerId } }),

  /** Deletes a banner, and its views and clicks with it, and records it, in one transaction. */
  remove: (id: string, audit: { actorId: string; actorEmail: string; action: string; targetId: string; targetLabel: string }) =>
    db.$transaction(async (tx) => {
      await tx.banner.delete({ where: { id } });
      await tx.auditLog.create({ data: audit });
    }),

  /** Counts a banner showing or being clicked. Only for a banner that is running today. */
  async recordEvent(bannerId: string, type: "VIEW" | "CLICK", today: Date) {
    const running = await db.banner.count({ where: { id: bannerId, removedAt: null, startsAt: { lte: today }, endsAt: { gte: today } } });
    if (!running) return false;
    await db.bannerEvent.create({ data: { bannerId, type } });
    return true;
  },
};
