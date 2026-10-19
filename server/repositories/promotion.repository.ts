import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

import { walletRepository } from "./wallet.repository";

interface Charge {
  amount: number;
  description: string;
}

/** Database access for promotions. Every query is limited to the owner's own business. */
export const promotionRepository = {
  listByOwner: (ownerId: string) =>
    db.promotion.findMany({
      where: { business: { ownerId } },
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),

  findOwned: (id: string, ownerId: string) =>
    db.promotion.findFirst({ where: { id, business: { ownerId } } }),

  slugTaken: async (slug: string) => (await db.promotion.count({ where: { slug } })) > 0,

  categoryExists: async (id: string) => (await db.category.count({ where: { id } })) > 0,

  /** A charge taken together with the save: both happen, or neither does. */
  async create(data: Prisma.PromotionUncheckedCreateInput, charge?: Charge) {
    return db.$transaction(async (tx) => {
      const created = await tx.promotion.create({ data });
      if (charge) await walletRepository.spend(tx, data.businessId, charge.amount, "PUBLISH", charge.description);
      return created;
    });
  },

  /** Returns how many rows changed: 0 means it isn't this owner's promotion. */
  async update(id: string, ownerId: string, data: Prisma.PromotionUncheckedUpdateInput, charge?: Charge) {
    return db.$transaction(async (tx) => {
      const found = await tx.promotion.findFirst({ where: { id, business: { ownerId } }, select: { businessId: true } });
      if (!found) return 0;
      await tx.promotion.update({ where: { id }, data });
      if (charge) await walletRepository.spend(tx, found.businessId, charge.amount, "PUBLISH", charge.description);
      return 1;
    });
  },

  /** Returns how many rows changed: 0 means it isn't this owner's promotion. */
  async end(id: string, ownerId: string) {
    const { count } = await db.promotion.updateMany({
      where: { id, business: { ownerId }, status: "PUBLISHED" },
      data: { status: "ENDED" },
    });
    return count;
  },

  async remove(id: string, ownerId: string) {
    const { count } = await db.promotion.deleteMany({ where: { id, business: { ownerId } } });
    return count;
  },
};
