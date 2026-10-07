"use client";

import { useState } from "react";
import { Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  coinAmountError,
  coinPriceMinor,
  coinSavingPercent,
  MAX_COIN_PURCHASE,
  MIN_COIN_PURCHASE,
  sameAmountForMore,
} from "@/lib/coins";
import { formatMoney } from "@/lib/formatters/currency";
import { formatCoins, formatNumber } from "@/lib/formatters/number";

import { WALLET_COPY } from "../constant/wallet.constant";

interface CustomCoinAmountProps {
  onBuy: (coins: number) => void;
  pending: boolean;
}

export function CustomCoinAmount({ onBuy, pending }: CustomCoinAmountProps) {
  const [value, setValue] = useState("");
  const typed = value.trim() !== "";
  const error = typed ? coinAmountError(value) : null;
  const valid = typed && !error;
  const coins = valid ? Number(value) : 0;
  const better = valid ? sameAmountForMore(coins) : null;
  const saving = valid ? coinSavingPercent(coins) : 0;

  return (
    <div className="space-y-3 rounded-xl border bg-surface p-4">
      <div>
        <label htmlFor="custom-coins" className="text-sm font-semibold">
          {WALLET_COPY.customTitle}
        </label>
        <p className="text-xs text-muted-foreground">
          {formatNumber(MIN_COIN_PURCHASE)} to {formatNumber(MAX_COIN_PURCHASE)}{" "}
          coins. {WALLET_COPY.customHint}
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative sm:w-56">
          <Coins className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gold" />
          <Input
            id="custom-coins"
            inputMode="numeric"
            placeholder="e.g. 250"
            value={value}
            onChange={(e) =>
              setValue(e.target.value.replace(/[^\d]/g, "").slice(0, 6))
            }
            aria-invalid={!!error}
            aria-describedby="custom-coins-help"
            className="pl-10"
          />
        </div>
        <Button
          disabled={!valid || pending}
          onClick={() => onBuy(coins)}
          className="sm:self-start"
        >
          {valid
            ? `${WALLET_COPY.buy} ${formatCoins(coins)} · ${formatMoney(coinPriceMinor(coins))}`
            : WALLET_COPY.buy}
        </Button>
      </div>
      <div id="custom-coins-help" className="min-h-5 text-sm">
        {error && (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        )}
        {valid && saving > 0 && !better && (
          <p className="text-muted-foreground">
            You save {saving}% compared with the smallest pack.
          </p>
        )}
        {better && (
          <p className="text-muted-foreground">
            Get {formatNumber(better)} coins for the same price.{" "}
            <button
              type="button"
              onClick={() => setValue(String(better))}
              className="font-semibold text-primary underline"
            >
              Use {formatNumber(better)}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
