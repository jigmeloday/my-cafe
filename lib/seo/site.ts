import { SITE_NAME } from "@/components/public/constant/site.constant";

export const SEO = {
  name: SITE_NAME,
  tagline: "Discover what's happening",
  description: "Deals, events and new places from local businesses in Bhutan. Find what's on near you, save what you like and follow your favourite places.",
  /** The picture shown when a link is shared and the page has none of its own. */
  defaultImage: "/opengraph-image",
  themeColor: "#7f1d3a",
  country: "BT",
} as const;

/** The public address of the site, without a trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

/** "/deals" -> "https://example.com/deals". Full addresses are returned as they are. */
export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`);

/** Search results show about 155 characters, so shorter text isn't cut mid-word. */
export function clip(text: string, max = 155): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}
