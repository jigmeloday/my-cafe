import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

import type { AuditEntry } from "./admin-user.repository";

export const adminWalletRepository = {
  count: (where: Prisma.BusinessWhereInput) => db.business.count({ where }),

  list: (where: Prisma.BusinessWhereInput, skip: number, take: number) =>
    db.business.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: { id: true, name: true, slug: true, owner: { select: { email: true } }, wallet: { select: { balance: true } } },
    }),

  /** Adds coins, records them in the wallet history, and notes who did it. All three happen or none do. */
  async recharge(businessId: string, coins: number, description: string, audit: AuditEntry) {
    return db.$transaction(async (tx) => {
      const business = await tx.business.findUnique({ where: { id: businessId }, select: { name: true } });
      if (!business) return null;

      const wallet = await tx.wallet.upsert({ where: { businessId }, create: { businessId }, update: {} });
      const updated = await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: coins } }, select: { balance: true } });
      await tx.coinTransaction.create({
        data: { walletId: wallet.id, type: "PURCHASE", amount: coins, balanceAfter: updated.balance, description },
      });
      await tx.auditLog.create({ data: { ...audit, targetLabel: `${business.name} +${coins} coins` } });
      return { name: business.name, balance: updated.balance };
    });
  },
};
