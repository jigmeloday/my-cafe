import { Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/formatters/number";

import { LOW_BALANCE, WALLET_COPY } from "../constant/wallet.constant";

export function BalanceCard({ balance }: { balance: number }) {
  return (
    <section
      aria-label={WALLET_COPY.balance}
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-surface p-5"
    >
      <div className="flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-full bg-gold/15 text-gold">
          <Coins className="size-6" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{WALLET_COPY.balance}</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatNumber(balance)}{" "}
            <span className="text-base font-medium text-muted-foreground">
              coins
            </span>
          </p>
        </div>
      </div>
      <Button render={<a href="#buy" />}>{WALLET_COPY.buyTitle}</Button>
      {balance < LOW_BALANCE && (
        <p
          role="status"
          className="w-full rounded-lg bg-gold/15 px-3 py-2 text-sm text-[#8a6212]"
        >
          {WALLET_COPY.lowBalance}
        </p>
      )}
    </section>
  );
}
