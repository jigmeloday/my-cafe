import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";

import { TRANSACTION_TYPE, WALLET_COPY } from "../constant/wallet.constant";
import type { TransactionRow } from "../model/wallet.type";
import {
  formatSignedCoins,
  formatTransactionDate,
} from "../utils/wallet.utils";

export function RecentActivity({ rows }: { rows: TransactionRow[] }) {
  if (rows.length === 0)
    return (
      <p className="text-sm text-muted-foreground">{WALLET_COPY.noActivity}</p>
    );

  return (
    <div className="space-y-3">
      <ul className="divide-y rounded-xl border bg-surface">
        {rows.map(({ id, type, description, amount, date }) => {
          const { label, tone } = TRANSACTION_TYPE[type];
          return (
            <li key={id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTransactionDate(date)}
                </p>
              </div>
              <StatusBadge tone={tone} className="hidden sm:inline-flex">
                {label}
              </StatusBadge>
              <span
                className={`w-20 shrink-0 text-right text-sm font-semibold tabular-nums ${amount > 0 ? "text-success" : ""}`}
              >
                {formatSignedCoins(amount)}
              </span>
            </li>
          );
        })}
      </ul>
      <Link
        href="/business/transactions"
        className="inline-block text-sm font-semibold text-primary hover:underline"
      >
        {WALLET_COPY.viewAll}
      </Link>
    </div>
  );
}
