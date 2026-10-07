"use server";

import { coinAmountError } from "@/lib/coins";

import type { ActionResult } from "./action.type";

// TODO: create a payment with the provider for coinPriceMinor(coins), then credit the wallet from
// the payment webhook (never from the browser) and record a wallet transaction.
export async function buyCoinsAction({
  coins,
}: {
  coins: number;
}): Promise<ActionResult> {
  const problem = Number.isInteger(coins)
    ? coinAmountError(String(coins))
    : "Enter a whole number of coins.";
  if (problem) return { ok: false, error: problem };
  return {
    ok: false,
    error: "Payments aren't connected yet. Buying coins is coming soon.",
  };
}
