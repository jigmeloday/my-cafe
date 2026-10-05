import { META_SEPARATOR } from "@/components/public/constant/detail.constant";
import { slugify, uniqueByHref } from "@/components/public/utils/detail.utils";

import { EVENTS } from "../../events/constant/events.data";
import { NEW_PLACES } from "../../discover/constant/discover.data";
import { PROMOTIONS } from "../../promotions/constant/promotions.data";
import { OFFER_SECTIONS } from "../../home/constant/offers.constant";

const homePlaces = OFFER_SECTIONS.find((s) => s.id === "new")?.items ?? [];

export const BUSINESSES = uniqueByHref([...homePlaces, ...NEW_PLACES]);

// Businesses mentioned by offers and events (their `meta[0]` is "Name · Area").
export const REFERENCED_BUSINESSES = [
  ...new Map(
    [...PROMOTIONS, ...EVENTS].map(({ meta: [place = ""] }) => {
      const [name = "", area = ""] = place.split(META_SEPARATOR);
      return [slugify(name), { slug: slugify(name), name, area }] as const;
    }),
  ).values(),
];
