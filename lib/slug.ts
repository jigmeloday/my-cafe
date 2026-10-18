/** "Druk Café!" -> "druk-cafe". Never empty: falls back to `fallback`. */
export const slugify = (text: string, fallback = "item", max = 40) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max) || fallback;
