import type { OrderStatus } from "@/generated/prisma/client";
import { db } from "@/lib/db";

/** Orders that are still open: the customer is waiting on the seller, or the seller on the customer. */
const OPEN: OrderStatus[] = ["PLACED", "CONFIRMED"];

const itemSelect = {
  id: true,
  slug: true,
  title: true,
  type: true,
  status: true,
  removedAt: true,
  endsAt: true,
  startsAt: true,
  price: true,
  orderMode: true,
  orderLabel: true,
  business: { select: { id: true, name: true, status: true, owner: { select: { email: true, name: true } } } },
} as const;

export const orderRepository = {
  /** The item with what ordering needs to know. Null when there is no such promotion. */
  itemFor: (promotionId: string) => db.promotion.findUnique({ where: { id: promotionId }, select: itemSelect }),

  /** How many unfinished orders this person already has for this item. */
  openCount: (promotionId: string, userId: string) => db.productOrder.count({ where: { promotionId, userId, status: { in: OPEN } } }),

  create: (data: { promotionId: string; userId: string; name: string; phone: string; quantity: number; note: string; unitPrice: number | null }) =>
    db.productOrder.create({ data }),

  /** A customer's orders, newest first. */
  forUser: (userId: string) =>
    db.productOrder.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        quantity: true,
        unitPrice: true,
        status: true,
        createdAt: true,
        promotion: { select: { slug: true, title: true, type: true, removedAt: true, business: { select: { name: true } } } },
      },
    }),

  /** Every order for a business's items, newest first. */
  forOwner: (ownerId: string) =>
    db.productOrder.findMany({
      where: { promotion: { business: { ownerId } } },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        name: true,
        phone: true,
        quantity: true,
        note: true,
        unitPrice: true,
        status: true,
        createdAt: true,
        promotion: { select: { title: true } },
      },
    }),

  /** How many orders are waiting for the seller to answer. */
  newCount: (ownerId: string) => db.productOrder.count({ where: { status: "PLACED", promotion: { business: { ownerId } } } }),

  /** Moves an order from one of the given states to another. False when it isn't theirs or isn't in such a state. */
  async move(where: { id: string } & ({ userId: string } | { ownerId: string }), from: OrderStatus[], to: OrderStatus) {
    const owner = "ownerId" in where ? { promotion: { business: { ownerId: where.ownerId } } } : { userId: where.userId };
    const { count } = await db.productOrder.updateMany({ where: { id: where.id, status: { in: from }, ...owner }, data: { status: to } });
    return count > 0;
  },
};
