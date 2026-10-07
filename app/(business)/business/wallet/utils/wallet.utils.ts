import { formatDateTime } from "@/lib/formatters/date";

import { RECENT_COUNT } from "../constant/wallet.constant";
import type { CoinTransaction, TransactionRow } from "../model/wallet.type";

/** Adds the balance after each transaction, working backwards from the current balance (newest first). */
export function withBalances(
  transactions: CoinTransaction[],
  currentBalance: number,
): TransactionRow[] {
  let balance = currentBalance;
  return transactions.map((t) => {
    const row = { ...t, balanceAfter: balance };
    balance -= t.amount;
    return row;
  });
}

export const recentTransactions = (rows: TransactionRow[]) =>
  rows.slice(0, RECENT_COUNT);

export const formatTransactionDate = formatDateTime;

export const formatSignedCoins = (amount: number) =>
  `${amount > 0 ? "+" : amount < 0 ? "−" : ""}${Math.abs(amount).toLocaleString("en")}`;
