"use client";

import { FormMessage } from "@/components/shared/form-message";
import { useAction } from "@/hooks/use-action";
import { buyCoinsAction } from "@/server/actions/wallet.actions";

import { CoinPacks } from "./coin-packs";
import { CustomCoinAmount } from "./custom-coin-amount";

export function CoinPurchase() {
  const { run, result, pending } = useAction(buyCoinsAction);
  const buy = (coins: number) => run({ coins });

  return (
    <div className="space-y-3">
      {result && !result.ok && (
        <FormMessage tone="error">{result.error}</FormMessage>
      )}
      <CoinPacks onBuy={buy} pending={pending} />
      <CustomCoinAmount onBuy={buy} pending={pending} />
    </div>
  );
}
