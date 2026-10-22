import { db } from "@/lib/db";

import { walletRepository } from "./wallet.repository";

const withBusiness = { business: { select: { id: true, name: true, slug: true } }, promotion: { select: { slug: true, status: true } } } as const;

export const bannerRepository = {
  listByOwner: (ownerId: string) =>
    db.banner.findMany({ where: { business: { ownerId } }, orderBy: { createdAt: "desc" }, include: withBusiness }),

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
      include: withBusiness,
    }),

  /** Saves the banner and takes its price from the wallet in one transaction: both happen, or neither. */
  create: (data: { businessId: string; promotionId: string | null; title: string; description: string; imageKey: string; startsAt: Date; endsAt: Date; coins: number }) =>
    db.$transaction(async (tx) => {
      const banner = await tx.banner.create({ data });
      await walletRepository.spend(tx, data.businessId, data.coins, "BANNER", `Homepage banner: ${data.title}`);
      return banner;
    }),

  /** Saves a banner an admin made for a business. No coins are taken; who did it is noted. All happens or none does. */
  createByAdmin: (
    data: { businessId: string | null; title: string; description: string; imageKey: string; linkUrl: string; startsAt: Date; endsAt: Date },
    actor: { id: string; email: string },
  ) =>
    db.$transaction(async (tx) => {
      const banner = await tx.banner.create({ data: { ...data, promotionId: null, coins: 0 }, include: withBusiness });
      await tx.auditLog.create({
        data: { actorId: actor.id, actorEmail: actor.email, action: "banner.create", targetId: banner.id, targetLabel: `${banner.business?.name ?? "Announcement"}: ${data.title}` },
      });
      return banner;
    }),

  /** Takes a running or scheduled banner down, tells its owner, and notes who did it. False when it was already down. */
  takeDown: (id: string, actor: { id: string; email: string }) =>
    db.$transaction(async (tx) => {
      const banner = await tx.banner.findFirst({ where: { id, removedAt: null }, include: withBusiness });
      if (!banner) return false;
      await tx.banner.update({ where: { id }, data: { removedAt: new Date() } });
      const owner = banner.businessId ? await tx.business.findUnique({ where: { id: banner.businessId }, select: { ownerId: true } }) : null;
      if (owner) {
        await tx.notification.create({
          data: { userId: owner.ownerId, title: "A banner was taken down", description: `Your banner “${banner.title}” was taken down by Nook.`, href: "/business/banners" },
        });
      }
      await tx.auditLog.create({
        data: { actorId: actor.id, actorEmail: actor.email, action: "banner.takedown", targetId: id, targetLabel: `${banner.business?.name ?? "Announcement"}: ${banner.title}` },
      });
      return true;
    }),

  /** Every banner on the site, newest first, for the admin. */
  listAll: () => db.banner.findMany({ orderBy: { createdAt: "desc" }, include: withBusiness }),

  /** Businesses a banner can be made for. */
  businessOptions: () =>
    db.business.findMany({ where: { status: { not: "SUSPENDED" } }, orderBy: { name: "asc" }, select: { id: true, name: true } }),

  /** Counts a banner showing or being clicked. Only for a banner that is running today. */
  async recordEvent(bannerId: string, type: "VIEW" | "CLICK", today: Date) {
    const running = await db.banner.count({ where: { id: bannerId, removedAt: null, startsAt: { lte: today }, endsAt: { gte: today } } });
    if (!running) return false;
    await db.bannerEvent.create({ data: { bannerId, type } });
    return true;
  },
};
