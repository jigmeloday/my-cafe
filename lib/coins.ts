/**
 * Coins are prepaid credits a business spends on visibility. They are whole numbers, never fractions.
 * All prices live here so they are easy to change. These are sample values.
 */
export const COIN_COSTS = {
  /** Per follower who will receive the email. */
  emailPerRecipient: 1,
  /** Per day a promotion is shown in the homepage banner. */
  bannerPerDay: 200,
  /** Per day a promotion is ranked at the top of discovery lists. */
  topRankPerDay: 100,
} as const;

/** Days a placement can run. "0" means not selected. Strings so they work as form select values. */
export const PLACEMENT_DAYS = ["0", "3", "7", "14"] as const;

/**
 * Price per 1,000 coins, in the display currency's minor units, by amount bought.
 * Buying more coins costs less per coin. Packs and custom amounts share these tiers,
 * so a custom 500 coins costs exactly the same as the 500 pack. Sample values.
 */
const PRICE_TIERS = [
  { minCoins: 5000, per1000Minor: 3500 },
  { minCoins: 1000, per1000Minor: 4000 },
  { minCoins: 500, per1000Minor: 4500 },
  { minCoins: 0, per1000Minor: 5000 },
] as const;

const BASE_PER_1000 = PRICE_TIERS[PRICE_TIERS.length - 1].per1000Minor;

export const MIN_COIN_PURCHASE = 50;
export const MAX_COIN_PURCHASE = 100_000;

const tierPrice = (coins: number, per1000Minor: number) =>
  Math.ceil((coins * per1000Minor) / 1000);

/**
 * Price in minor units for `coins` coins. Whole numbers, rounded up.
 * You pay whichever is cheaper: your amount at its own tier, or the next tiers' minimum
 * (so 499 coins never costs more than 500). That keeps the price from ever dropping as you buy more.
 */
export const coinPriceMinor = (coins: number) =>
  Math.min(
    ...PRICE_TIERS.map((tier) =>
      tierPrice(Math.max(coins, tier.minCoins), tier.per1000Minor),
    ),
  );

/** Whole-number percent saved compared with the smallest-tier price per coin. */
export const coinSavingPercent = (coins: number) =>
  Math.max(
    0,
    Math.round(
      (1 - coinPriceMinor(coins) / ((coins * BASE_PER_1000) / 1000)) * 100,
    ),
  );

/** A bigger amount that costs the same as `coins`, e.g. 499 -> 500. Null when there isn't one. */
export function sameAmountForMore(coins: number): number | null {
  const price = coinPriceMinor(coins);
  const bigger = PRICE_TIERS.filter(
    (t) =>
      t.minCoins > coins && tierPrice(t.minCoins, t.per1000Minor) === price,
  );
  return bigger.length ? Math.max(...bigger.map((t) => t.minCoins)) : null;
}

/** Returns a message when `value` isn't a valid number of coins to buy, otherwise null. */
export function coinAmountError(value: string): string | null {
  if (!/^\d+$/.test(value.trim())) return "Enter a whole number of coins.";
  const coins = Number(value);
  if (coins < MIN_COIN_PURCHASE)
    return `The minimum is ${MIN_COIN_PURCHASE} coins.`;
  if (coins > MAX_COIN_PURCHASE)
    return `The maximum is ${MAX_COIN_PURCHASE.toLocaleString("en")} coins at a time.`;
  return null;
}

const PACK_COINS = [
  { id: "starter", coins: 100 },
  { id: "standard", coins: 500 },
  { id: "plus", coins: 1000 },
  { id: "pro", coins: 5000 },
] as const;

/** Quick-pick packs. Each costs the same as typing that amount yourself. */
export const COIN_PACKS = PACK_COINS.map((pack) => ({
  ...pack,
  priceMinor: coinPriceMinor(pack.coins),
}));

export type CoinPackId = (typeof PACK_COINS)[number]["id"];

export const COIN_TRANSACTION_TYPES = [
  "PURCHASE",
  "EMAIL_CAMPAIGN",
  "BANNER",
  "TOP_RANK",
  "REFUND",
] as const;

export const emailCost = (recipients: number) =>
  recipients * COIN_COSTS.emailPerRecipient;
export const bannerCost = (days: number) => days * COIN_COSTS.bannerPerDay;
export const topRankCost = (days: number) => days * COIN_COSTS.topRankPerDay;

export const hasEnoughCoins = (balance: number, cost: number) =>
  balance >= cost;
