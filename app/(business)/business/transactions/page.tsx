import type { Metadata } from "next";

import { requireRole } from "@/lib/session";
import { walletService } from "@/services/wallet/wallet.service";

import { TransactionsExplorer } from "./components/transactions-explorer";
import { TRANSACTIONS_COPY } from "./constant/transactions.constant";

export const metadata: Metadata = { title: "Transactions — Nook business" };

export default async function TransactionsPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const { rows } = await walletService.overview(user);

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
