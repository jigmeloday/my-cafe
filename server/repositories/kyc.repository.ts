import { db } from "@/lib/db";

import type { AuditEntry } from "./admin-user.repository";

const withBusiness = {
  business: { select: { id: true, name: true, slug: true, status: true, owner: { select: { id: true, name: true, email: true } } } },
} as const;

export const kycRepository = {
  /** The most recent request a business sent (any status), or null. */
  latestForBusiness: (businessId: string) =>
    db.kycSubmission.findFirst({ where: { businessId }, orderBy: { submittedAt: "desc" } }),

  create: (data: { businessId: string; ownerName: string; idNumber: string; licenseNumber: string; idDocKey: string; licenseDocKey: string; premisesKey: string }) =>
    db.kycSubmission.create({ data }),

  /** For the admin queue: newest waiting first, or everything. */
  list: (status: "PENDING" | "ALL") =>
    db.kycSubmission.findMany({
      where: status === "ALL" ? {} : { status },
      orderBy: { submittedAt: status === "PENDING" ? "asc" : "desc" },
      include: withBusiness,
      take: 200,
    }),

  findById: (id: string) => db.kycSubmission.findUnique({ where: { id }, include: withBusiness }),

  /** Records that an admin opened a document. */
  logView: (entry: AuditEntry) => db.auditLog.create({ data: entry }),

  /** How many requests are waiting for review. */
  countPending: () => db.kycSubmission.count({ where: { status: "PENDING" } }),

  /** The request that contains this stored file, or null. A file nobody submitted is never served. */
  findByFileKey: (key: string) =>
    db.kycSubmission.findFirst({ where: { OR: [{ idDocKey: key }, { licenseDocKey: key }, { premisesKey: key }] }, select: { id: true, businessId: true, business: { select: { name: true } } } }),

  /**
   * Settles a waiting request, in one transaction: marks it approved or rejected, verifies the business when
   * approved, tells the owner, and writes the audit log. Returns false when it wasn't waiting any more.
   */
  async review(opts: {
    id: string;
    decision: "APPROVED" | "REJECTED";
    note: string;
    adminId: string;
    now: Date;
    notice: { userId: string; title: string; description: string; href: string };
    audit: AuditEntry;
  }) {
    return db.$transaction(async (tx) => {
      const { count } = await tx.kycSubmission.updateMany({
        where: { id: opts.id, status: "PENDING" },
        data: { status: opts.decision, reviewNote: opts.decision === "REJECTED" ? opts.note : "", reviewedById: opts.adminId, reviewedAt: opts.now },
      });
      if (count === 0) return false;

      if (opts.decision === "APPROVED") {
        const sub = await tx.kycSubmission.findUniqueOrThrow({ where: { id: opts.id }, select: { businessId: true } });
        // A suspended business stays suspended: approval doesn't lift that.
        await tx.business.updateMany({ where: { id: sub.businessId, status: { not: "SUSPENDED" } }, data: { status: "VERIFIED" } });
      }
      await tx.notification.create({ data: opts.notice });
      await tx.auditLog.create({ data: opts.audit });
      return true;
    });
  },
};
