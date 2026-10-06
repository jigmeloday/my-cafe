const integer = new Intl.NumberFormat("en");
const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatNumber = (value: number) => integer.format(value);
export const formatCompact = (value: number) => compact.format(value);

/** 0.0274 -> "2.74%" */
export const formatPercent = (ratio: number, digits = 2) =>
  `${(ratio * 100).toFixed(digits)}%`;
