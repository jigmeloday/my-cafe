export interface TransactionFilterOption {
  id: "ALL" | "IN" | "OUT";
  label: string;
}

export const FILTERS: TransactionFilterOption[] = [
  { id: "ALL", label: "All" },
  { id: "IN", label: "Added" },
  { id: "OUT", label: "Spent" },
];

export const TRANSACTIONS_COPY = {
  title: "Transactions",
  subtitle: "Every coin that comes into or goes out of your wallet.",
  searchPlaceholder: "Search transactions",
  emptyTitle: "No transactions match",
  emptyDescription: "Try a different search or filter.",
};

export type TransactionFilter = TransactionFilterOption["id"];
