import type { Metadata } from "next";

import { BUSINESS_SHELL } from "@/components/business/constant/business-nav.constant";

import { BalanceCard } from "./components/balance-card";
import { CoinPurchase } from "./components/coin-purchase";
import { CoinUses } from "./components/coin-uses";
import { RecentActivity } from "./components/recent-activity";
import { WALLET_COPY } from "./constant/wallet.constant";
import { COIN_TRANSACTIONS } from "./constant/wallet.data";
import { recentTransactions, withBalances } from "./utils/wallet.utils";

export const metadata: Metadata = { title: "Wallet — kuzu business" };

export default function WalletPage() {
  const rows = withBalances(COIN_TRANSACTIONS, BUSINESS_SHELL.walletCoins);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1>{WALLET_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{WALLET_COPY.subtitle}</p>
      </header>
      <BalanceCard balance={BUSINESS_SHELL.walletCoins} />
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
