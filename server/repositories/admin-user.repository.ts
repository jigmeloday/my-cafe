import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

/** Database access for the admin user list. No rules live here: see services/admin. */
export const adminUserRepository = {
  list: (where: Prisma.UserWhereInput, skip: number, take: number) =>
    db.user.findMany({
      where,
      // createdAt can repeat, so id breaks ties. Without it, rows could jump between pages.
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        status: true,
        createdAt: true,
        profile: { select: { phone: true } },
        sessions: { select: { updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 1 },
      },
    }),

  count: (where: Prisma.UserWhereInput) => db.user.count({ where }),

  countsByRole: () => db.user.groupBy({ by: ["role"], _count: { _all: true } }),

  countSuspended: () => db.user.count({ where: { status: "SUSPENDED" } }),

  findById: (id: string) => db.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, status: true } }),

  countBusinesses: (ownerId: string) => db.business.count({ where: { ownerId } }),

  /** Changes the status, signs the person out everywhere when suspending, and records it, all or nothing. */
  setStatus: (entry: AuditEntry, status: "ACTIVE" | "SUSPENDED") =>
    db.$transaction([
      db.user.update({ where: { id: entry.targetId }, data: { status } }),
      ...(status === "SUSPENDED" ? [db.session.deleteMany({ where: { userId: entry.targetId } })] : []),
      db.auditLog.create({ data: entry }),
    ]),

  /** Deletes the person (their profile, saves, sessions and so on go with them) and records it. */
  deleteUser: (entry: AuditEntry) =>
    db.$transaction([db.user.delete({ where: { id: entry.targetId } }), db.auditLog.create({ data: entry })]),
};

export interface AuditEntry {
  actorId: string;
  actorEmail: string;
  action: "user.suspend" | "user.unsuspend" | "user.delete" | "wallet.recharge" | "report.dismiss" | "report.warn" | "report.remove" | "kyc.view" | "kyc.approve" | "kyc.reject" | "business.verify" | "business.suspend" | "business.reinstate";
  targetId: string;
  /** The person's name and email, copied in so the record still makes sense after they are deleted. */
  targetLabel: string;
}
