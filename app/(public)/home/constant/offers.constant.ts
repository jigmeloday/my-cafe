
/** The width of a business card in a row: wider than a promotion's, so its picture has room. */
export const OFFER_CARD_WIDE =
  "w-[78%] shrink-0 snap-start sm:w-[46%] md:w-[34%] lg:w-[calc((100%-3rem)/4)]";

export const OFFER_CARD_WIDTH =
  "w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[22%] lg:w-[calc((100%-5rem)/6)]";

/** The home page's rows. `key` says which list from the database fills each one. */
export const HOME_SECTIONS = [
  { id: "featured", key: "featured", title: "Featured", href: "/deals" },
  { id: "popular", key: "popular", title: "Popular offers", href: "/deals" },
  { id: "new", key: "newPlaces", title: "Just opened", href: "/discover" },
  { id: "events", key: "events", title: "Happening soon", href: "/events" },
] as const;

