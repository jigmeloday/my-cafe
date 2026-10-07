import { DEFAULT_CURRENCY } from "@/lib/constants";

/** Formats an integer amount in minor units (e.g. 1050 -> "$10.50"). Display only. */
export function formatMoney(
  minor: number,
  currency: string = DEFAULT_CURRENCY,
): string {
  const formatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  });
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return formatter.format(minor / 10 ** digits);
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
