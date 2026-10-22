"use server";

import { redirect } from "next/navigation";

import { coinAmountError, coinPriceMinor } from "@/lib/coins";
import { getCurrentUser } from "@/lib/session";
import { businessService } from "@/services/business/business.service";
import { getPaymentProvider } from "@/services/payment/payment.provider";

import type { ActionResult } from "./action.type";

/** Starts buying coins. Without a payment provider connected it says so, and nothing is charged or added. */
export async function buyCoinsAction({ coins }: { coins: number }): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return { ok: false, error: "Please log in with a business account." };

  const problem = Number.isInteger(coins) ? coinAmountError(String(coins)) : "Enter a whole number of coins.";
  if (problem) return { ok: false, error: problem };

  const provider = getPaymentProvider();
  if (!provider) return { ok: false, error: "Online payment isn't available yet. Please contact our support team to buy coins." };

  const business = await businessService.ensure(user);
  const { url } = await provider.createCheckout({
    businessId: business.id,
    coins,
    amountMinor: coinPriceMinor(coins),
    returnUrl: `${process.env.BETTER_AUTH_URL ?? ""}/business/wallet`,
  });
  // Coins are added later, when the provider confirms the payment (never from the browser).
  redirect(url);
}
