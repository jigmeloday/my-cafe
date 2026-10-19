import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

import type { AuditEntry } from "./admin-user.repository";

const row = {
  id: true,
  name: true,
  slug: true,
  town: true,
  dzongkhag: true,
  status: true,
  createdAt: true,
  owner: { select: { id: true, name: true, email: true } },
  _count: { select: { promotions: { where: { status: "PUBLISHED", removedAt: null } } } },
  kycSubmissions: { orderBy: { submittedAt: "desc" }, take: 1, select: { id: true, status: true } },
} satisfies Prisma.BusinessSelect;

export type BusinessRowData = Prisma.BusinessGetPayload<{ select: typeof row }>;

export const adminBusinessRepository = {
  count: (where: Prisma.BusinessWhereInput) => db.business.count({ where }),

  countsByStatus: () => db.business.groupBy({ by: ["status"], _count: { _all: true } }),

  list: (where: Prisma.BusinessWhereInput, skip: number, take: number) =>
    db.business.findMany({ where, orderBy: { createdAt: "desc" }, skip, take, select: row }),

  /** Followers per business page address ("/businesses/<slug>"). */
  async followerCounts(hrefs: string[]) {
    if (hrefs.length === 0) return new Map<string, number>();
    const rows = await db.follow.groupBy({ by: ["href"], where: { href: { in: hrefs } }, _count: { _all: true } });
    return new Map(rows.map((r) => [r.href, r._count._all]));
  },

  findById: (id: string) =>
    db.business.findUnique({
      where: { id },
      select: { id: true, name: true, status: true, owner: { select: { id: true } }, kycSubmissions: { where: { status: "APPROVED" }, take: 1, select: { id: true } } },
    }),

  /**
   * Changes a business's status together with its audit entry and (optionally) a message to the owner, in one
   * transaction. `from` guards the change: it only happens if the business is still in that state.
   */
  async setStatus(opts: { id: string; from: "PENDING" | "VERIFIED" | "SUSPENDED"; to: "PENDING" | "VERIFIED" | "SUSPENDED"; audit: AuditEntry; notice: { userId: string; title: string; description: string; href: string } | null }) {
    return db.$transaction(async (tx) => {
      const { count } = await tx.business.updateMany({ where: { id: opts.id, status: opts.from }, data: { status: opts.to } });
      if (count === 0) return false;
      if (opts.notice) await tx.notification.create({ data: opts.notice });
      await tx.auditLog.create({ data: opts.audit });
      return true;
    });
  },
};
