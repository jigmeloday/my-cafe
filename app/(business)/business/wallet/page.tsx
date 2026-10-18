import type { Metadata } from "next";

import { requireRole } from "@/lib/session";
import { walletService } from "@/services/wallet/wallet.service";

import { BalanceCard } from "./components/balance-card";
import { CoinPurchase } from "./components/coin-purchase";
import { CoinUses } from "./components/coin-uses";
import { RecentActivity } from "./components/recent-activity";
import { WALLET_COPY } from "./constant/wallet.constant";
import { recentTransactions } from "./utils/wallet.utils";

export const metadata: Metadata = { title: "Wallet — kuzu business" };

export default async function WalletPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const { balance, rows } = await walletService.overview(user);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1>{WALLET_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{WALLET_COPY.subtitle}</p>
      </header>
      <BalanceCard balance={balance} />
      <section
        id="buy"
        aria-labelledby="buy-coins"
        className="scroll-mt-20 space-y-3"
      >
        <div className="space-y-1">
          <h2 id="buy-coins">{WALLET_COPY.buyTitle}</h2>
          <p className="text-sm text-muted-foreground">{WALLET_COPY.buyHint}</p>
        </div>
        <CoinPurchase />
      </section>
      <section aria-labelledby="coin-uses" className="space-y-3">
        <h2 id="coin-uses">{WALLET_COPY.usesTitle}</h2>
        <CoinUses />
      </section>
      <section aria-labelledby="recent" className="space-y-3">
        <h2 id="recent">{WALLET_COPY.recentTitle}</h2>
        <RecentActivity rows={recentTransactions(rows)} />
      </section>
    </div>
  );
}
