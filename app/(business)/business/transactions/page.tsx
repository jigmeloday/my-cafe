import type { Metadata } from "next";

import { BUSINESS_SHELL } from "@/components/business/constant/business-nav.constant";

import { COIN_TRANSACTIONS } from "../wallet/constant/wallet.data";
import { withBalances } from "../wallet/utils/wallet.utils";
import { TransactionsExplorer } from "./components/transactions-explorer";
import { TRANSACTIONS_COPY } from "./constant/transactions.constant";

export const metadata: Metadata = { title: "Transactions — kuzu business" };

export default function TransactionsPage() {
  const rows = withBalances(COIN_TRANSACTIONS, BUSINESS_SHELL.walletCoins);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{TRANSACTIONS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">
          {TRANSACTIONS_COPY.subtitle}
        </p>
      </header>
      <TransactionsExplorer rows={rows} />
    </div>
  );
}
