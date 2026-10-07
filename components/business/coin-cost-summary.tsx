import Link from "next/link";
import { Coins } from "lucide-react";

import { formatCoins } from "@/lib/formatters/number";
import { hasEnoughCoins } from "@/lib/coins";

import { BUSINESS_SHELL } from "./constant/business-nav.constant";

interface CoinCostSummaryProps {
  /** Total coins this action will cost. */
  cost: number;
  label?: string;
}

export function CoinCostSummary({
  cost,
  label = "Cost",
}: CoinCostSummaryProps) {
  const balance = BUSINESS_SHELL.walletCoins;
  const enough = hasEnoughCoins(balance, cost);

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">{label}</span>
        <span className="flex items-center gap-1.5 font-semibold tabular-nums">
          <Coins className="size-4 text-gold" /> {formatCoins(cost)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Your balance</span>
        <span className="font-medium tabular-nums">{formatCoins(balance)}</span>
      </div>
      {!enough && (
        <p
          role="status"
          className="rounded-lg bg-gold/15 px-3 py-2 text-xs text-[#8a6212]"
        >
          You need {formatCoins(cost - balance)} more.{" "}
          <Link
            href={BUSINESS_SHELL.walletHref}
            className="font-semibold underline"
          >
            Buy coins
          </Link>
        </p>
      )}
    </div>
  );
}
