import { DEFAULT_CURRENCY } from "@/lib/constants";

/** The sign shown before an amount. Intl has no short form for the ngultrum, so it is spelled out here. */
export const currencySymbol = (currency: string = DEFAULT_CURRENCY): string =>
  currency === "BTN"
    ? "Nu."
    : new Intl.NumberFormat("en", { style: "currency", currency }).formatToParts(0).find((part) => part.type === "currency")?.value ?? currency;

/** Formats an integer amount in minor units (e.g. 125000 -> "Nu. 1,250"). Display only. */
export function formatMoney(
  minor: number,
  currency: string = DEFAULT_CURRENCY,
): string {
  const amount = new Intl.NumberFormat("en", { minimumFractionDigits: minor % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 }).format(minor / 100);
  const symbol = currencySymbol(currency);
  return symbol.length > 1 ? `${symbol} ${amount}` : `${symbol}${amount}`;
}

export const MONEY_PATTERN = /^\d{1,7}(\.\d{1,2})?$/;

/** Parses "0.50" into 50 (minor units) without floating-point drift. Returns null when invalid. */
export function parseMoney(input: string): number | null {
  const value = input.trim();
  if (!MONEY_PATTERN.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

/** 50 -> "0.50": the plain-number form used to fill money inputs. */
export const minorToInput = (minor: number): string => (minor / 100).toFixed(2);
