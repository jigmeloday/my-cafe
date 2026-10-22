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

  /** Banners showing on `today`: started, not ended, and either an admin's announcement or from a business and owner that aren't suspended. */
  active: (today: Date) =>
    db.banner.findMany({
      where: {
        removedAt: null,
        review: "APPROVED",
        startsAt: { lte: today },
        endsAt: { gte: today },
        OR: [{ businessId: null }, { business: { status: { not: "SUSPENDED" }, owner: { status: "ACTIVE" } } }],
      },
      orderBy: { createdAt: "desc" },
      relationLoadStrategy: "join", include: withBusiness,
    }),

  /** Saves the banner and takes its price from the wallet in one transaction: both happen, or neither. */
  create: (data: { businessId: string; promotionId: string | null; title: string; description: string; imageKey: string; startsAt: Date; endsAt: Date; coins: number }) =>
    db.$transaction(async (tx) => {
      const banner = await tx.banner.create({ data: { ...data, review: "PENDING" } });
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

  /** How many banners are waiting for an admin to look at them. */
  pendingReviewCount: () => db.banner.count({ where: { review: "PENDING", removedAt: null } }),

  /**
   * Settles a banner waiting for review. Approving makes it live (a banner whose start day has passed while it
   * waited is moved to start today, keeping all its paid days). Rejecting a banner that was never approved gives the
   * coins back; one that was approved before (and sent for a second check after an edit) has already run, so it
   * doesn't. Either way the owner is told and who did it is noted. All of it happens, or none. False when it wasn't waiting.
   */
  review: (
    id: string,
    decision: "APPROVED" | "REJECTED",
    note: string,
    today: Date,
    actor: { id: string; email: string },
  ) =>
    db.$transaction(async (tx) => {
      const banner = await tx.banner.findFirst({ where: { id, review: "PENDING", removedAt: null }, include: withBusiness });
      if (!banner) return false;
      const now = new Date();

      let shift = 0;
      if (decision === "APPROVED" && banner.startsAt < today) shift = today.getTime() - banner.startsAt.getTime();
      await tx.banner.update({
        where: { id },
        data: {
          review: decision,
          reviewNote: decision === "REJECTED" ? note : "",
          reviewedAt: now,
          ...(shift > 0 ? { startsAt: today, endsAt: new Date(banner.endsAt.getTime() + shift) } : {}),
        },
      });

      const businessId = banner.businessId;
      const owner = businessId ? await tx.business.findUnique({ where: { id: businessId }, select: { ownerId: true } }) : null;
      // Only a banner that was never shown is paid back.
      const refund = decision === "REJECTED" && banner.reviewedAt === null && banner.coins > 0;
      if (refund && businessId) {
        const wallet = await tx.wallet.upsert({ where: { businessId }, create: { businessId }, update: {} });
        const updated = await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: banner.coins } }, select: { balance: true } });
        await tx.coinTransaction.create({
          data: { walletId: wallet.id, type: "REFUND", amount: banner.coins, balanceAfter: updated.balance, description: `Refund: banner not approved (${banner.title})` },
        });
      }
      if (owner) {
        await tx.notification.create({
          data: {
            userId: owner.ownerId,
            title: decision === "APPROVED" ? "Your banner was approved" : "Your banner wasn't approved",
            description:
              decision === "APPROVED"
                ? `“${banner.title}” is approved and will show on the home page on its days.`
                : `“${banner.title}” wasn't approved: ${note} ${refund ? `Your ${banner.coins} coins were refunded.` : "Because it had already been approved and shown, the coins aren't refunded."}`,
            href: "/business/banners",
          },
        });
      }
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          actorEmail: actor.email,
          action: decision === "APPROVED" ? "banner.approve" : "banner.reject",
          targetId: id,
          targetLabel: `${banner.business?.name ?? "Announcement"}: ${banner.title}`,
        },
      });
      return true;
    }),

  /** Every banner on the site, newest first, for the admin. */
  listAll: () => db.banner.findMany({ orderBy: { createdAt: "desc" }, include: withBusiness }),

  /** Businesses a banner can be made for. */
  businessOptions: () =>
    db.business.findMany({ where: { status: { not: "SUSPENDED" } }, orderBy: { name: "asc" }, select: { id: true, name: true } }),

  /** One of the owner's banners with its business, or null. */
  findOwned: async (id: string, ownerId: string) => {
    const banner = await db.banner.findFirst({ where: { id, business: { ownerId } }, include: { business: { select: { id: true, name: true, status: true } } } });
    // Only a business's own banner can match, so it always has a business.
    return banner?.business ? { ...banner, business: banner.business } : null;
  },

  /**
   * Saves the changes to a banner, takes the price of any added days from the wallet, and records the edit, all in
   * one transaction. `paid` is the extra coins, added to what the banner has cost in total.
   */
  update: (
    id: string,
    businessId: string,
    data: { title: string; description: string; imageKey: string; endsAt: Date; review?: "PENDING" },
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

  /**
   * Deletes a banner, and its views and clicks with it, and records it, in one transaction. With `refund`, the coins
   * go back to the wallet in the same transaction: the banner is gone and the coins are back, or neither happened.
   */
  remove: (
    id: string,
    audit: { actorId: string; actorEmail: string; action: string; targetId: string; targetLabel: string },
    refund?: { businessId: string; coins: number; title: string },
  ) =>
    db.$transaction(async (tx) => {
      await tx.banner.delete({ where: { id } });
      if (refund && refund.coins > 0) {
        const wallet = await tx.wallet.upsert({ where: { businessId: refund.businessId }, create: { businessId: refund.businessId }, update: {} });
        const updated = await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: refund.coins } }, select: { balance: true } });
        await tx.coinTransaction.create({
          data: { walletId: wallet.id, type: "REFUND", amount: refund.coins, balanceAfter: updated.balance, description: `Refund: banner deleted before approval (${refund.title})` },
        });
      }
      await tx.auditLog.create({ data: audit });
    }),

  /** Counts a banner showing or being clicked. Only for a banner that is running today. */
  async recordEvent(bannerId: string, type: "VIEW" | "CLICK", today: Date) {
    const running = await db.banner.count({ where: { id: bannerId, removedAt: null, review: "APPROVED", startsAt: { lte: today }, endsAt: { gte: today } } });
    if (!running) return false;
    await db.bannerEvent.create({ data: { bannerId, type } });
    return true;
  },
};
