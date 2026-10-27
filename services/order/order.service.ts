import { MAX_OPEN_ORDERS } from "@/lib/constants";
import { formatMoney } from "@/lib/formatters/currency";
import { canOrder } from "@/lib/orders";
import type { OrderInput } from "@/lib/validations/order.schema";
import type { OrderStatus } from "@/generated/prisma/client";
import { orderRepository as repo } from "@/server/repositories/order.repository";
import { sendEmail } from "@/services/email/email.service";
import { orderReceivedEmail } from "@/services/email/order-templates";
import { bhutanToday } from "@/services/discovery/discovery.service";

type Result = { ok: true; message?: string } | { ok: false; error: string };
type Item = NonNullable<Awaited<ReturnType<typeof repo.itemFor>>>;

export interface OrderableStatus {
  /** The words on the order button. */
  label: string;
  /** The price of one, in minor units, or null. */
  price: number | null;
}

/** Whether people can order now: a live deal or sale item set to take orders here, not ended, from a business in good standing. */
function isOpen(item: Item | null, today: Date): item is Item {
  return (
    !!item &&
    canOrder(item.type) &&
    item.orderMode === "NOOK" &&
    item.status === "PUBLISHED" &&
    item.removedAt === null &&
    item.business.status !== "SUSPENDED" &&
    (item.startsAt === null || item.startsAt <= today) &&
    (item.endsAt === null || item.endsAt >= today)
  );
}

const NOT_OPEN = "This item isn't taking orders right now.";

/** What the seller can do with an order, by the state it is in now. */
const NEXT: Record<"CONFIRMED" | "COMPLETED" | "CANCELLED", OrderStatus[]> = {
  CONFIRMED: ["PLACED"],
  COMPLETED: ["CONFIRMED"],
  CANCELLED: ["PLACED", "CONFIRMED"],
};

export const orderService = {
  /** What the item page needs to show the order button. Null when the item doesn't take orders here. */
  async status(promotionId: string, now = new Date()): Promise<(OrderableStatus & { slug: string; title: string }) | null> {
    const item = await repo.itemFor(promotionId);
    if (!isOpen(item, bhutanToday(now))) return null;
    return { label: item.orderLabel, price: item.price, slug: item.slug, title: item.title };
  },

  /** A signed-in customer orders an item. The seller is emailed; the order is saved first, so a failed email loses nothing. */
  async place(user: { id: string; role: string }, input: OrderInput, now = new Date()): Promise<Result> {
    if (user.role !== "USER") return { ok: false, error: "Only customer accounts can place orders." };
    const item = await repo.itemFor(input.promotionId);
    if (!isOpen(item, bhutanToday(now))) return { ok: false, error: NOT_OPEN };
    if ((await repo.openCount(item.id, user.id)) >= MAX_OPEN_ORDERS) {
      return { ok: false, error: "You already have several open orders for this item. Wait for the seller to answer, or cancel one first." };
    }

    await repo.create({ promotionId: item.id, userId: user.id, name: input.name, phone: input.phone, quantity: input.quantity, note: input.note, unitPrice: item.price });

    try {
      await sendEmail({
        to: item.business.owner.email,
        ...orderReceivedEmail({
          ownerName: item.business.owner.name,
          item: item.title,
          quantity: input.quantity,
          total: item.price === null ? "" : formatMoney(item.price * input.quantity),
          customerName: input.name,
          phone: input.phone,
          note: input.note,
        }),
      });
    } catch (error) {
      console.error("[email] Couldn't send the order email:", (error as Error).message);
    }
    return { ok: true, message: "Your order was sent." };
  },

  /** A customer's own orders. */
  mine: (userId: string) => repo.forUser(userId),

  /** A customer takes back an order the seller hasn't answered yet. */
  async cancelMine(userId: string, orderId: string): Promise<Result> {
    return (await repo.move({ id: orderId, userId }, ["PLACED"], "CANCELLED"))
      ? { ok: true, message: "Your order was cancelled." }
      : { ok: false, error: "This order can't be cancelled any more. Please contact the seller." };
  },

  /** The seller's orders. */
  forOwner: (ownerId: string) => repo.forOwner(ownerId),

  /** How many orders are waiting for the seller to answer. */
  newCount: (ownerId: string) => repo.newCount(ownerId),

  /** The seller confirms, completes or cancels an order. */
  async setStatus(ownerId: string, orderId: string, to: keyof typeof NEXT): Promise<Result> {
    return (await repo.move({ id: orderId, ownerId }, NEXT[to], to)) ? { ok: true } : { ok: false, error: "This order can't be changed to that." };
  },
};
