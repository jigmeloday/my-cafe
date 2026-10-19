import type { CoinTransaction, TransactionRow } from "@/app/(business)/business/wallet/model/wallet.type";
import { businessRepository } from "@/server/repositories/business.repository";
import { walletRepository } from "@/server/repositories/wallet.repository";

export const HISTORY_LIMIT = 200;

/** Bhutan is UTC+6 all year (no daylight saving), so local time is just a fixed shift from UTC. */
const toBhutanTime = (date: Date) => new Date(date.getTime() + 6 * 3_600_000).toISOString().slice(0, 16);

export interface WalletOverview {
  balance: number;
  rows: TransactionRow[];
}

export const walletService = {
  /** Coins the owner's business has. Zero before the business or its wallet exists. */
  async balanceFor(owner: { id: string }) {
    const business = await businessRepository.findByOwner(owner.id);
    return business ? walletRepository.balance(business.id) : 0;
  },

  /** The balance and the latest transactions, newest first. */
  async overview(owner: { id: string }): Promise<WalletOverview> {
    const business = await businessRepository.findByOwner(owner.id);
    if (!business) return { balance: 0, rows: [] };

    const [balance, history] = await Promise.all([
      walletRepository.balance(business.id),
      walletRepository.history(business.id, HISTORY_LIMIT),
    ]);
    return {
      balance,
      rows: history.map((t) => ({
        id: t.id,
        type: t.type as CoinTransaction["type"],
        description: t.description,
        amount: t.amount,
        date: toBhutanTime(t.createdAt),
        balanceAfter: t.balanceAfter,
      })),
    };
  },

  /**
   * Adds coins after a payment is confirmed. The payment provider's webhook calls this (never the browser).
   * Safe to call twice for the same `reference`: the second call changes nothing.
   */
  async creditPurchase(businessId: string, coins: number, reference: string) {
    if (!Number.isInteger(coins) || coins <= 0) throw new Error("Coins must be a positive whole number.");
    return walletRepository.credit(businessId, coins, `Bought ${coins.toLocaleString("en")} coins`, reference);
  },
};
