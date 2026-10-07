import { Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { COIN_PACKS, coinSavingPercent } from "@/lib/coins";
import { formatMoney } from "@/lib/formatters/currency";
import { formatNumber } from "@/lib/formatters/number";

import { WALLET_COPY } from "../constant/wallet.constant";

interface CoinPacksProps {
  onBuy: (coins: number) => void;
  pending: boolean;
}

export function CoinPacks({ onBuy, pending }: CoinPacksProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {COIN_PACKS.map((pack, index) => {
        const saving = coinSavingPercent(pack.coins);
        const best = index === COIN_PACKS.length - 1;
        return (
          <li
            key={pack.id}
            className="relative flex flex-col gap-3 rounded-xl border bg-surface p-4"
          >
            {best && (
              <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {WALLET_COPY.best}
              </span>
            )}
            <div>
              <p className="flex items-center gap-1.5 text-xl font-semibold tabular-nums">
                <Coins className="size-5 text-gold" />{" "}
                {formatNumber(pack.coins)}
              </p>
              <p className="text-xs text-muted-foreground">
                {saving > 0 ? `Save ${saving}%` : "coins"}
              </p>
            </div>
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => onBuy(pack.coins)}
              className="mt-auto"
            >
              {WALLET_COPY.buy} · {formatMoney(pack.priceMinor)}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
