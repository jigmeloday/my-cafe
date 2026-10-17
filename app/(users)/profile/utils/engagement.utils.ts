import type { PromotionCardData } from "@/components/public/model/promotion.type";
import type { TaggedPromotion } from "@/components/public/model/promotion.type";

import type { FollowedPlace } from "../model/profile.type";

const INTEREST_TAGS: Record<string, string> = {
  "Food & drink": "food",
  "Cafés": "food",
  Fashion: "fashion",
  Electronics: "electronics",
  Wellness: "wellness",
};

/** Keeps the saved order (newest first) and drops addresses that no longer exist. */
export function resolveByHref<T extends { href: string }>(hrefs: string[], catalog: T[]): T[] {
  const byHref = new Map(catalog.map((item) => [item.href, item]));
  return hrefs.flatMap((href) => byHref.get(href) ?? []);
}

export function resolvePlaces(
  hrefs: string[],
  places: { slug: string; name: string; area: string; subtitle?: string }[]
): FollowedPlace[] {
  const bySlug = new Map(places.map((p) => [p.slug, p]));
  return hrefs.flatMap((href) => {
    const place = bySlug.get(href.replace("/businesses/", ""));
    return place ? [{ href, title: place.name, subtitle: place.subtitle ?? place.area }] : [];
  });
}

/** Deals that match the person's interests, skipping ones already saved. Falls back to popular deals. */
export function recommendOffers(
  interests: string[],
  savedHrefs: string[],
  deals: TaggedPromotion[],
  limit = 4
): { items: PromotionCardData[]; personal: boolean } {
  const wanted = new Set(interests.flatMap((i) => INTEREST_TAGS[i] ?? []));
  const open = deals.filter((d) => !savedHrefs.includes(d.href));
  const matching = open.filter((d) => d.tags.some((t) => wanted.has(t)));
  const rest = open.filter((d) => !matching.includes(d));
  return { items: [...matching, ...rest].slice(0, limit), personal: matching.length > 0 };
}
