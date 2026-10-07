import type { TransactionRow } from "../../wallet/model/wallet.type";
import type { TransactionFilter } from "../constant/transactions.constant";

export function filterTransactions(
  rows: TransactionRow[],
  filter: TransactionFilter,
  query: string,
) {
  const text = query.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (filter === "ALL" || (filter === "IN" ? r.amount > 0 : r.amount < 0)) &&
      (!text || r.description.toLowerCase().includes(text)),
  );
}

export const countFor = (rows: TransactionRow[], filter: TransactionFilter) =>
  filter === "ALL"
    ? rows.length
    : rows.filter((r) => (filter === "IN" ? r.amount > 0 : r.amount < 0))
        .length;
