"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FilterChips } from "@/components/shared/filter-chips";
import { SearchInput } from "@/components/shared/search-input";

import type { TransactionRow } from "../../wallet/model/wallet.type";
import {
  FILTERS,
  TRANSACTIONS_COPY,
  type TransactionFilter,
} from "../constant/transactions.constant";
import { countFor, filterTransactions } from "../utils/transactions.utils";
import { TransactionsTable } from "./transactions-table";

export function TransactionsExplorer({ rows }: { rows: TransactionRow[] }) {
  const [filter, setFilter] = useState<TransactionFilter>("ALL");
  const [query, setQuery] = useState("");
  const visible = filterTransactions(rows, filter, query);
  const options = FILTERS.map(({ id, label }) => ({
    id,
    label: `${label} ${countFor(rows, id)}`,
  }));

  return (
    <div className="space-y-4">
      <SearchInput
        className="sm:max-w-sm"
        aria-label={TRANSACTIONS_COPY.searchPlaceholder}
        placeholder={TRANSACTIONS_COPY.searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <FilterChips options={options} active={filter} onChange={setFilter} />
      {visible.length > 0 ? (
        <TransactionsTable rows={visible} />
      ) : (
        <EmptyState
          title={TRANSACTIONS_COPY.emptyTitle}
          description={TRANSACTIONS_COPY.emptyDescription}
        />
      )}
    </div>
  );
}
