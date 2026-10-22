"use client";

import { FormMessage } from "@/components/shared/form-message";
import { useAction } from "@/hooks/use-action";
import { buyCoinsAction } from "@/server/actions/wallet.actions";

import { WALLET_COPY } from "../constant/wallet.constant";
import { CoinPacks } from "./coin-packs";
import { CustomCoinAmount } from "./custom-coin-amount";
import { SupportNotice } from "./support-notice";

export function CoinPurchase({ paymentsConnected }: { paymentsConnected: boolean }) {
  const { run, result, pending } = useAction(buyCoinsAction);
  const buy = (coins: number) => run({ coins });

  if (!paymentsConnected) {
    return (
      <div className="space-y-4">
        <SupportNotice />
        <CoinPacks />
        <p className="text-xs text-muted-foreground">{WALLET_COPY.priceListHint}</p>
      </div>
    );
  }

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
