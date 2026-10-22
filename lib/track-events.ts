/**
 * How long the one-way visitor codes are kept next to each visit. After that `npm run purge:analytics` deletes
 * site visits and blanks the codes, keeping only the totals. The Privacy Policy states this number.
 */
export const ANALYTICS_RETENTION_DAYS = 90;

/** What can be counted about a business's page and about the site. Shared by the browser and the server. */
export const BUSINESS_EVENT_TYPES = ["VIEW", "CALL", "EMAIL", "WEBSITE", "SOCIAL"] as const;
export type BusinessEventType = (typeof BUSINESS_EVENT_TYPES)[number];

/** The clicks on a business's contact links, in the order they are shown. */
export const CLICK_EVENT_TYPES = BUSINESS_EVENT_TYPES.filter((type) => type !== "VIEW");

export const SITE_SECTIONS = ["home", "discover", "deals", "events", "search", "business", "promotion", "other"] as const;
export type SiteSection = (typeof SITE_SECTIONS)[number];

/** Which part of the site a page address belongs to: "/deals/pizza" -> "deals". */
export function sectionFromPath(path: string): SiteSection {
  const first = path.split("?")[0].split("/").filter(Boolean)[0];
  if (!first) return "home";
  if (first === "businesses") return "business";
  if (first === "promotions") return "promotion";
  return (["discover", "deals", "events", "search"] as const).find((section) => section === first) ?? "other";
}

/** The kind of click a contact line on a business page is, or null when it isn't a link people can click. */
export function contactEventType(key: string): BusinessEventType | null {
  if (key === "phone") return "CALL";
  if (key === "email") return "EMAIL";
  if (key === "website") return "WEBSITE";
  if (key === "facebook" || key === "instagram" || key === "tiktok") return "SOCIAL";
  return null;
}
