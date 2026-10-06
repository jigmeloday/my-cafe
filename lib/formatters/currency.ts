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
