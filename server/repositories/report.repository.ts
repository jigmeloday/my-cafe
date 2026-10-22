import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

import type { AuditEntry } from "./admin-user.repository";

const include = {
  reporter: { select: { id: true } },
  promotion: { select: { id: true, title: true, slug: true, type: true, removedAt: true, business: { select: { name: true, ownerId: true } } } },
  banner: { select: { id: true, title: true, removedAt: true, business: { select: { name: true, slug: true, ownerId: true } } } },
} satisfies Prisma.ReportInclude;

export type ReportRow = Prisma.ReportGetPayload<{ include: typeof include }>;

export const reportRepository = {
  /** Live promotion that nobody has taken down: the only kind that can be reported. */
  promotionReportable: async (id: string) =>
    (await db.promotion.count({ where: { id, status: "PUBLISHED", removedAt: null } })) > 0,

  /** A banner that is running today and hasn't been taken down. */
  bannerReportable: async (id: string, today: Date) =>
    (await db.banner.count({ where: { id, removedAt: null, review: "APPROVED", startsAt: { lte: today }, endsAt: { gte: today } } })) > 0,

  /** Saves a report. Returns false when this person already reported this ad (one report each). */
  async create(data: { reporterId: string; promotionId?: string; bannerId?: string; reason: string; details: string }) {
    try {
      await db.report.create({ data: { ...data, reason: data.reason as never } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") return false;
      throw error;
    }
  },

  list: (status: "OPEN" | "RESOLVED" | "ALL") =>
    db.report.findMany({ where: status === "ALL" ? {} : { status }, orderBy: { createdAt: "asc" }, include }),

  /**
   * Settles every open report about one ad, in one transaction: marks them resolved, takes the ad down when the
   * decision is REMOVED, tells the owner when it is WARNED or REMOVED, and writes the audit log.
   * Returns how many reports were settled (0 when there was nothing open).
   */
  async resolveTarget(opts: {
    kind: "promotion" | "banner";
    targetId: string;
    decision: "DISMISSED" | "WARNED" | "REMOVED";
    adminId: string;
    audit: AuditEntry;
    notice: { ownerId: string; title: string; description: string; href: string } | null;
    now: Date;
  }) {
    const where = opts.kind === "promotion" ? { promotionId: opts.targetId } : { bannerId: opts.targetId };
    return db.$transaction(async (tx) => {
      const { count } = await tx.report.updateMany({
        where: { ...where, status: "OPEN" },
        data: { status: "RESOLVED", decision: opts.decision, resolvedById: opts.adminId, resolvedAt: opts.now },
      });
      if (count === 0) return 0;

      if (opts.decision === "REMOVED") {
        if (opts.kind === "promotion") await tx.promotion.update({ where: { id: opts.targetId }, data: { removedAt: opts.now, status: "ENDED" } });
        else await tx.banner.update({ where: { id: opts.targetId }, data: { removedAt: opts.now } });
      }
      if (opts.notice) await tx.notification.create({ data: { userId: opts.notice.ownerId, title: opts.notice.title, description: opts.notice.description, href: opts.notice.href } });
      await tx.auditLog.create({ data: opts.audit });
      return count;
    });
  },

  /** Notices from Nook to a business owner, newest first. */
  noticesFor: (userId: string, since: Date) =>
    db.notification.findMany({ where: { userId, readAt: null, createdAt: { gte: since } }, orderBy: { createdAt: "desc" }, take: 5 }),

  /** Closing a message marks it read, so it doesn't come back. Only the person it was sent to can close it. */
  dismissNotice: (userId: string, id: string) => db.notification.updateMany({ where: { id, userId, readAt: null }, data: { readAt: new Date() } }),
};
