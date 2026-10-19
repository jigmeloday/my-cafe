/** "Druk Café!" -> "druk-cafe". Never empty: falls back to `fallback`. */
export const slugify = (text: string, fallback = "item", max = 40) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    // Drop the accent marks, so "Café" becomes "cafe", not "cafe-s".
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max) || fallback;
