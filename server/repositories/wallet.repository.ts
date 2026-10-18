import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

type Tx = Prisma.TransactionClient;
type SpendType = "PUBLISH" | "EMAIL_CAMPAIGN" | "BANNER" | "TOP_RANK";

/** Thrown inside a transaction when the wallet can't cover a charge, so everything in it is undone. */
export class InsufficientCoinsError extends Error {
  constructor(
    public readonly balance: number,
    public readonly needed: number,
  ) {
    super("Not enough coins");
  }
}

export const walletRepository = {
  /** Coins a business has. A business with no wallet row yet has none. */
  async balance(businessId: string) {
    return (await db.wallet.findUnique({ where: { businessId }, select: { balance: true } }))?.balance ?? 0;
  },

  /** Newest first. Each row already has the balance after it. */
  history: (businessId: string, take: number) =>
    db.coinTransaction.findMany({
      where: { wallet: { businessId } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take,
    }),

  /**
   * Adds bought coins to the wallet. `reference` is the payment provider's id for the purchase; it is unique,
   * so calling this twice for the same payment (a repeated webhook) adds the coins only once.
   * Returns false when that payment was already credited.
   */
  async credit(businessId: string, coins: number, description: string, reference: string) {
    try {
      await db.$transaction(async (tx) => {
        const wallet = await tx.wallet.upsert({ where: { businessId }, create: { businessId }, update: {} });
        const updated = await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: coins } }, select: { balance: true } });
        await tx.coinTransaction.create({
          data: { walletId: wallet.id, type: "PURCHASE", amount: coins, balanceAfter: updated.balance, description, reference },
        });
      });
      return true;
    } catch (error) {
      // P2002 = the reference already exists: this payment was credited before. The transaction rolled back.
      if ((error as { code?: string }).code === "P2002") return false;
      throw error;
    }
  },

  /**
   * Takes coins from the wallet and records it, inside the caller's transaction.
   * The balance check and the deduction are one statement, so two charges at once can never overspend.
   */
  async spend(tx: Tx, businessId: string, amount: number, type: SpendType, description: string) {
    const wallet = await tx.wallet.upsert({ where: { businessId }, create: { businessId }, update: {} });
    const { count } = await tx.wallet.updateMany({
      where: { id: wallet.id, balance: { gte: amount } },
      data: { balance: { decrement: amount } },
    });
    if (count === 0) throw new InsufficientCoinsError(wallet.balance, amount);

    const after = await tx.wallet.findUniqueOrThrow({ where: { id: wallet.id }, select: { balance: true } });
    await tx.coinTransaction.create({
      data: { walletId: wallet.id, type, amount: -amount, balanceAfter: after.balance, description },
    });
  },
};
