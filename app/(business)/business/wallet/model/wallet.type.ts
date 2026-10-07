import type { COIN_TRANSACTION_TYPES } from "@/lib/coins";

export type CoinTransactionType = (typeof COIN_TRANSACTION_TYPES)[number];

/** `amount` is signed whole coins: positive adds to the wallet, negative spends. */
export interface CoinTransaction {
  id: string;
  type: CoinTransactionType;
  description: string;
  amount: number;
  /** Local date-time "YYYY-MM-DDTHH:mm". */
  date: string;
}

export interface TransactionRow extends CoinTransaction {
  balanceAfter: number;
}
