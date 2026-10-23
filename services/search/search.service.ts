import type { PromotionCardData } from "@/components/public/model/promotion.type";
import { mainCategory, openedText } from "@/lib/discovery-tags";
import { mediaUrl } from "@/lib/media";
import { escapeLike, parseSearch } from "@/lib/search";
import { overlaps, whenRange, type WhenId } from "@/lib/search-when";
import { searchRepository } from "@/server/repositories/search.repository";
import { bhutanToday, toCard } from "@/services/discovery/discovery.service";

export interface SearchInput {
  what: string;
  where: string;
  when: WhenId;
}

export interface SearchResults {
  deals: PromotionCardData[];
  events: PromotionCardData[];
  places: PromotionCardData[];
  total: number;
}

/** The most items fetched per group. Enough to browse, small enough to stay quick. */
const PER_GROUP = 24;
const MAX_WHERE = 50;

/** Makes what a person typed safe and tidy: capped length, "%" and "_" taken literally, words split. */
export function cleanQuery({ what, where }: Pick<SearchInput, "what" | "where">) {
  return {
    words: parseSearch(what).words.map(escapeLike),
    where: escapeLike(where.trim().slice(0, MAX_WHERE)),
  };
}

export const searchService = {
  /**
   * Looks for live promotions, events and places. Every word typed must match (any order, any letter case);
   * "Where" narrows to a town, area or address; "When" keeps only things running in that time.
   */
  async search(input: SearchInput, now = new Date()): Promise<SearchResults> {
    const today = bhutanToday(now);
    const text = cleanQuery(input);
    const range = whenRange(input.when, today);

    const [promotions, businesses] = await Promise.all([
      searchRepository.promotions(today, text, PER_GROUP * 2),
      searchRepository.businesses(text, PER_GROUP),
    ]);

    const running = promotions.filter((p) => overlaps(p.startsAt, p.endsAt, range));
    const events = running.filter((p) => p.type === "EVENT").slice(0, PER_GROUP).map((p) => toCard(p, today));
    const deals = running.filter((p) => p.type !== "EVENT").slice(0, PER_GROUP).map((p) => toCard(p, today));

    const places = businesses.map((b): PromotionCardData => {
      const main = mainCategory(b.promotions.map((p) => p.category?.name ?? null));
      const area = b.town || b.dzongkhag;
      return {
        id: b.id,
        title: b.name,
        meta: [[main, area].filter(Boolean).join(" · ") || "Bhutan", openedText(b.createdAt, now)],
        highlight: b.tagline,
        href: `/businesses/${b.slug}`,
        canSave: false,
        wide: true,
        imageUrl: b.coverKey ? mediaUrl(b.coverKey) : b.logoKey ? mediaUrl(b.logoKey) : undefined,
      };
    });

    return { deals, events, places, total: deals.length + events.length + places.length };
  },
};
