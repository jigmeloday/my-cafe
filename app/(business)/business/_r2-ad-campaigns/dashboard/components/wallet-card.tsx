import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/formatters/currency";

import { DASHBOARD_COPY } from "../constant/dashboard.constant";
import { CAMPAIGNS, WALLET } from "../constant/dashboard.data";

export function WalletCard() {
  const active = CAMPAIGNS.filter((c) => c.status === "ACTIVE").length;

  return (
    <section
      aria-labelledby="wallet"
      className="flex flex-col gap-4 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <h2 id="wallet">{DASHBOARD_COPY.walletTitle}</h2>
      <p className="text-3xl font-semibold tracking-tight">
        {formatMoney(WALLET.balanceMinor)}
      </p>
      <dl className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            {DASHBOARD_COPY.walletSpent}
          </dt>
          <dd className="font-medium">
            {formatMoney(WALLET.spentThisMonthMinor)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            {DASHBOARD_COPY.walletCampaigns}
          </dt>
          <dd className="font-medium">{active}</dd>
        </div>
      </dl>
      <Button
        render={<Link href="/business/wallet" />}
        className="mt-auto w-full"
      >
        <Plus /> {DASHBOARD_COPY.addFunds}
      </Button>
    </section>
  );
}
