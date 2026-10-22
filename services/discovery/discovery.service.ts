import type { ActivityItem } from "@/app/(public)/businesses/model/business.type";
import type { HeroSlideData } from "@/app/(public)/home/model/home.type";
import { CTA_TYPE_LABELS, TYPE_LABELS } from "@/lib/promotion-labels";
import { whatsappLink } from "@/lib/whatsapp";
import { mediaUrl } from "@/lib/media";
import type { DetailData, ShopLine } from "@/components/public/model/detail.type";
import { SITE_NAME } from "@/components/public/constant/site.constant";
import type { PromotionCardData, TaggedPromotion } from "@/components/public/model/promotion.type";
import { whenRange } from "@/lib/search-when";
import { dealTags, eventDateText, eventTags, mainCategory, openedText, placeTags } from "@/lib/discovery-tags";
import { FEATURED_ROW_SIZE } from "@/lib/featured";
import { bannerRepository } from "@/server/repositories/banner.repository";
import { discoveryRepository as repo, type LivePromotion } from "@/server/repositories/discovery.repository";
import { readHours } from "@/services/business/business.service";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 86_400_000;

/** Today's date in Bhutan (UTC+6), as a date at midnight UTC: how dates are stored. */
export function bhutanToday(now = new Date()) {
  return new Date(Math.floor((now.getTime() + 6 * 3_600_000) / DAY_MS) * DAY_MS);
}

const shortDate = (date: Date) => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;

/** "Until 20 Oct", "From 5 Oct" (not started yet), "5 – 20 Oct" or "Ongoing". */
export function validityText(startsAt: Date | null, endsAt: Date | null, today: Date) {
  if (endsAt && startsAt && startsAt > today) return `${shortDate(startsAt)} – ${shortDate(endsAt)}`;
  if (endsAt) return `Until ${shortDate(endsAt)}`;
  if (startsAt && startsAt > today) return `From ${shortDate(startsAt)}`;
  return "Ongoing";
}

const place = (b: { name: string; town: string; dzongkhag: string }) => [b.name, b.town || b.dzongkhag].filter(Boolean).join(" · ");
/** Events have their own pages; everything else is under /promotions. */
const href = (slug: string, type?: string) => (type === "EVENT" ? `/events/${slug}` : `/promotions/${slug}`);

export function toCard(p: LivePromotion, today: Date, badge?: string): PromotionCardData {
  return {
    id: p.id,
    badge,
    title: p.title,
    meta: [place(p.business), p.type === "EVENT" ? eventDateText(p.startsAt, p.endsAt) : validityText(p.startsAt, p.endsAt, today)],
    highlight: p.discount,
    href: href(p.slug, p.type),
    imageUrl: p.photos[0] ? mediaUrl(p.photos[0]) : undefined,
  };
}

type ActiveBanner = Awaited<ReturnType<typeof bannerRepository.active>>[number];

/** A paid banner as a hero slide. It opens the linked promotion, or the business's page. */
export function toBannerSlide(b: ActiveBanner): HeroSlideData {
  const linkable = b.promotion && b.promotion.status === "PUBLISHED";
  return {
    id: `banner-${b.id}`,
    bannerId: b.id,
    eyebrow: b.business.name,
    title: b.title,
    description: b.description,
    cta: linkable ? "View offer" : "Visit us",
    href: linkable ? href(b.promotion!.slug) : `/businesses/${b.business.slug}`,
    sponsored: true,
    imageLabel: b.title,
    imageUrl: mediaUrl(b.imageKey),
  };
}

/**
 * A random order (Fisher-Yates), so every item is equally likely to land in any position. Used so paying
 * advertisers get the first slot, and a place at all, equally often. `random` is replaceable for testing.
 */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface Landing {
  hero: HeroSlideData[];
  /** Paid places in the "Featured" row, shuffled, at most FEATURED_ROW_SIZE. */
  featured: PromotionCardData[];
  popular: PromotionCardData[];
  newPlaces: PromotionCardData[];
  events: PromotionCardData[];
}

const POPULAR_WINDOW_DAYS = 14;
const SECTION_SIZE = 6;
/** The most items a list page loads. Filtering happens in the browser, so this keeps the page light. */
const LIST_LIMIT = 120;
/** How many paid banners the home page shows at once. Raise it as more businesses buy banners. */
export const BANNER_SLOTS = 4;

/** The page data for one promotion. Shared by the public page and the owner's preview. */
/** The promotion's main button: a link, a phone call or a WhatsApp chat. None when it has nothing to open. */
function ctaFor(p: { ctaType: string; ctaUrl: string; title: string }, phone: string): DetailData["cta"] {
  if (p.ctaType === "VISIT_WEBSITE" && p.ctaUrl) return { label: CTA_TYPE_LABELS.VISIT_WEBSITE, href: p.ctaUrl };
  if (p.ctaType === "CONTACT_BUSINESS" && phone) return { label: CTA_TYPE_LABELS.CONTACT_BUSINESS, href: `tel:${phone.replace(/\s/g, "")}` };
  if (p.ctaType === "WHATSAPP") {
    const href = whatsappLink(phone, `Hi! I saw "${p.title}" on ${SITE_NAME} and I'd like to know more.`);
    return href ? { label: CTA_TYPE_LABELS.WHATSAPP, href, chat: true } : undefined;
  }
  return undefined;
}

function buildDetail(p: LivePromotion, related: LivePromotion[], today: Date, now: Date): DetailData {
    const b = p.business;
    const lines: ShopLine[] = [];
    const days = readHours(b.hours);
    const todays = days[(new Date(now.getTime() + 6 * 3_600_000).getUTCDay() + 6) % 7];
    if (b.hours) lines.push({ key: "hours", text: todays.closed ? "Closed today" : `Open today ${todays.open}–${todays.close}` });
    if (b.phone) lines.push({ key: "phone", text: b.phone, href: `tel:${b.phone.replace(/\s/g, "")}` });
    if (b.addressLine1) lines.push({ key: "address", text: [b.addressLine1, b.town].filter(Boolean).join(", ") });
    if (b.website) lines.push({ key: "website", text: b.website.replace(/^https?:\/\//, ""), href: b.website });

    const isEvent = p.type === "EVENT";
    const where = p.location || [b.town, b.dzongkhag].filter(Boolean).join(", ") || "—";
    return {
      kind: isEvent ? "event" : "promotion",
      slug: p.slug,
      title: p.title,
      badge: TYPE_LABELS[p.type],
      highlight: p.discount || TYPE_LABELS[p.type],
      facts: isEvent
        ? [
            { label: "Date", value: eventDateText(p.startsAt, p.endsAt) },
            { label: "Venue", value: where },
            { label: "Entry", value: p.discount || "—" },
            { label: "Area", value: b.town || b.dzongkhag || "—" },
          ]
        : [
            { label: "Offer", value: p.discount || "—" },
            { label: "Valid", value: validityText(p.startsAt, p.endsAt, today) },
            { label: "Where", value: where },
            { label: "Category", value: p.category?.name ?? "—" },
          ],
      description: p.description.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean),
      shop: { name: b.name, area: b.town || b.dzongkhag, href: `/businesses/${b.slug}` },
      related: related.map((r) => toCard(r, today)),
      promotionId: p.id,
      photos: p.photos.map(mediaUrl),
      cta: ctaFor(p, b.phone),
      shopLines: lines,
      shopLogo: b.logoKey ? mediaUrl(b.logoKey) : undefined,
      seo: {
        description: p.description || `${p.title} at ${b.name}${b.town ? `, ${b.town}` : ""}.`,
        startsAt: p.startsAt?.toISOString().slice(0, 10),
        endsAt: p.endsAt?.toISOString().slice(0, 10),
        place: where,
        street: [b.addressLine1, b.addressLine2].filter(Boolean).join(", ") || undefined,
        town: b.town || undefined,
        dzongkhag: b.dzongkhag || undefined,
      },
    };
}

export interface AreaTown {
  name: string;
  /** "3 places · Food, Cafés" */
  description: string;
}

export interface AreaGroup {
  /** The dzongkhag, e.g. "Thimphu". */
  name: string;
  towns: AreaTown[];
}

interface BusinessArea {
  town: string;
  dzongkhag: string;
  promotions: { category: { name: string } | null }[];
}

const MAX_AREA_TABS = 6;
const MAX_TOWNS = 12;

/**
 * Groups businesses by dzongkhag and town for "Explore by area". Busiest first. Each town says how many places
 * it has and what they mostly offer. Towns are matched ignoring letter case and stray spaces.
 */
export function groupAreas(businesses: BusinessArea[]): AreaGroup[] {
  const places = new Map<string, { name: string; towns: Map<string, { name: string; count: number; categories: Map<string, number> }> }>();

  for (const b of businesses) {
    const dzongkhag = b.dzongkhag.trim();
    const town = b.town.trim();
    if (!dzongkhag || !town) continue;

    const group = places.get(dzongkhag.toLowerCase()) ?? { name: dzongkhag, towns: new Map() };
    const entry = group.towns.get(town.toLowerCase()) ?? { name: town, count: 0, categories: new Map() };
    entry.count += 1;
    for (const p of b.promotions) if (p.category) entry.categories.set(p.category.name, (entry.categories.get(p.category.name) ?? 0) + 1);
    group.towns.set(town.toLowerCase(), entry);
    places.set(dzongkhag.toLowerCase(), group);
  }

  return [...places.values()]
    .map((group) => ({
      name: group.name,
      total: [...group.towns.values()].reduce((sum, t) => sum + t.count, 0),
      towns: [...group.towns.values()]
        .sort((a, c) => c.count - a.count || a.name.localeCompare(c.name))
        .slice(0, MAX_TOWNS)
        .map((t): AreaTown => {
          const top = [...t.categories.entries()].sort((a, c) => c[1] - a[1] || a[0].localeCompare(c[0])).slice(0, 2).map(([name]) => name);
          const places = `${t.count} ${t.count === 1 ? "place" : "places"}`;
          return { name: t.name, description: top.length ? `${places} · ${top.join(", ")}` : places };
        }),
    }))
    .sort((a, c) => c.total - a.total || a.name.localeCompare(c.name))
    .slice(0, MAX_AREA_TABS)
    .map(({ name, towns }) => ({ name, towns }));
}

/** What each interest on a profile means in terms of promotion categories, so offers can be matched to people. */
const INTEREST_CATEGORIES: Record<string, string[]> = {
  "Food & drink": ["Food", "Cafés"],
  "Cafés": ["Cafés"],
  Fashion: ["Fashion"],
  Electronics: ["Phones"],
  Wellness: ["Wellness"],
  Stays: ["Stays"],
  Kids: ["Kids"],
  Culture: ["Festival", "Events"],
  Music: ["Events"],
  Sports: ["Events", "Kids"],
  Books: ["Events"],
  Crafts: ["Fashion", "Home"],
};

const slugOf = (href: string) => href.slice(href.lastIndexOf("/") + 1);

export interface FollowedPlaceCard {
  href: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export interface CategoryLink {
  name: string;
  slug: string;
  count: number;
}

export interface CategoryPage {
  name: string;
  deals: PromotionCardData[];
  events: PromotionCardData[];
  places: PromotionCardData[];
}

export const discoveryService = {
  /** Everything a search engine may list, for the sitemap. */
  async sitemap(now = new Date()) {
    const [rows, categories] = await Promise.all([repo.sitemapRows(bhutanToday(now)), this.categories(now)]);
    return { ...rows, categories };
  },

  /** Categories that have something live in them, most to least, for browsing. */
  async categories(now = new Date()): Promise<CategoryLink[]> {
    const rows = await repo.categoriesWithCounts(bhutanToday(now));
    return rows
      .map((c) => ({ name: c.name, slug: c.slug, count: c._count.promotions }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  },

  /** Everything live in one category: deals, events, and the businesses behind them. Null for an unknown category. */
  async categoryPage(slug: string, now = new Date()): Promise<CategoryPage | null> {
    const category = await repo.findCategoryBySlug(slug);
    if (!category) return null;
    const today = bhutanToday(now);
    const started = { OR: [{ type: "EVENT" as const }, { startsAt: null }, { startsAt: { lte: today } }] };
    const rows = await repo.livePromotions(today, { AND: [{ categoryId: category.id }, started] }, 72, [{ createdAt: "desc" }]);

    const seen = new Set<string>();
    const places = rows.flatMap((p): PromotionCardData[] => {
      if (seen.has(p.business.id)) return [];
      seen.add(p.business.id);
      return [{
        id: p.business.id,
        title: p.business.name,
        meta: [[p.business.town, p.business.dzongkhag].filter(Boolean)[0] ?? "Bhutan"],
        highlight: "",
        href: `/businesses/${p.business.slug}`,
        imageUrl: p.business.logoKey ? mediaUrl(p.business.logoKey) : undefined,
      }];
    }).slice(0, 12);

    return {
      name: category.name,
      deals: rows.filter((p) => p.type !== "EVENT").map((p) => toCard(p, today)),
      events: rows.filter((p) => p.type === "EVENT").map((p) => toCard(p, today)),
      places,
    };
  },

  /**
   * The promotions someone saved, in the order they saved them (newest first). Each card keeps the address it was
   * saved under, so its heart stays filled. Offers that have ended are shown with an "Ended" label.
   */
  async savedCards(hrefs: string[], now = new Date()): Promise<PromotionCardData[]> {
    const today = bhutanToday(now);
    const rows = await repo.promotionsBySlugs(hrefs.filter((h) => !h.startsWith("/businesses/")).map(slugOf));
    const bySlug = new Map(rows.map((p) => [p.slug, p]));
    return hrefs.flatMap((href) => {
      const p = bySlug.get(slugOf(href));
      if (!p) return [];
      const ended = p.status === "ENDED" || (p.endsAt !== null && p.endsAt < today);
      return [{ ...toCard(p, today, ended ? "Ended" : undefined), href }];
    });
  },

  /** The places someone follows, in the order they followed them. */
  async followedPlaces(hrefs: string[]): Promise<FollowedPlaceCard[]> {
    const rows = await repo.businessesBySlugs(hrefs.map(slugOf));
    const bySlug = new Map(rows.map((b) => [b.slug, b]));
    return hrefs.flatMap((href) => {
      const b = bySlug.get(slugOf(href));
      if (!b) return [];
      const area = [b.town, b.dzongkhag].filter(Boolean).join(", ");
      return [{ href, title: b.name, subtitle: [area, b.tagline].filter(Boolean).join(" · "), imageUrl: b.logoKey ? mediaUrl(b.logoKey) : undefined }];
    });
  },

  /**
   * Deals that suit someone's interests, skipping ones they already saved. With nothing matching (or no interests),
   * it shows the newest deals instead and says so (`personal: false`).
   */
  async recommended(interests: string[], savedHrefs: string[], limit = 4, now = new Date()): Promise<{ items: PromotionCardData[]; personal: boolean }> {
    const today = bhutanToday(now);
    const saved = savedHrefs.map(slugOf);
    const started = { OR: [{ startsAt: null }, { startsAt: { lte: today } }] };
    const notSaved = saved.length ? { slug: { notIn: saved } } : {};
    const wanted = [...new Set(interests.flatMap((i) => INTEREST_CATEGORIES[i] ?? []))];

    const matching = wanted.length
      ? await repo.livePromotions(today, { AND: [{ type: { not: "EVENT" } }, started, notSaved, { category: { is: { name: { in: wanted } } } }] }, limit, [{ createdAt: "desc" }])
      : [];
    const fill = matching.length < limit
      ? await repo.livePromotions(today, { AND: [{ type: { not: "EVENT" } }, started, notSaved, { id: { notIn: matching.map((m) => m.id) } }] }, limit - matching.length, [{ createdAt: "desc" }])
      : [];
    return { items: [...matching, ...fill].map((p) => toCard(p, today)), personal: matching.length > 0 };
  },

  /** Events on the coming weekend (or what is left of it), soonest first. */
  async weekendEvents(limit = 4, now = new Date()): Promise<PromotionCardData[]> {
    const today = bhutanToday(now);
    const range = whenRange("weekend", today);
    if (!range) return [];
    const rows = await repo.livePromotions(today, { AND: [{ type: "EVENT" }, { startsAt: { lte: range.to } }, { OR: [{ endsAt: null }, { endsAt: { gte: range.from } }] }] }, limit, [{ startsAt: { sort: "asc", nulls: "last" } }]);
    return rows.map((p) => toCard(p, today, "This weekend"));
  },

  /** Where businesses are, for "Explore by area" on the home page. */
  async areas(): Promise<AreaGroup[]> {
    return groupAreas(await repo.businessAreas());
  },

  /** Everything the home page shows. Sections with nothing in them are simply empty. */
  async landing(now = new Date(), random: () => number = Math.random): Promise<Landing> {
    const today = bhutanToday(now);
    const started = { OR: [{ startsAt: null }, { startsAt: { lte: today } }] };

    // Everything is asked for at once: waiting for one answer before asking the next costs a full trip to the database.
    const [candidates, events, businesses, featuredNow, clicks, running] = await Promise.all([
      repo.livePromotions(today, { AND: [{ type: { not: "EVENT" } }, started] }, 30, [{ createdAt: "desc" }]),
      repo.livePromotions(today, { type: "EVENT" }, SECTION_SIZE, [{ startsAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }]),
      repo.newBusinesses(SECTION_SIZE),
      repo.featuredToday(today),
      repo.clicksSince(new Date(now.getTime() - POPULAR_WINDOW_DAYS * DAY_MS)),
      bannerRepository.active(today),
    ]);

    // "Popular" = most clicks lately, newest first among ties. Only promotions people actually clicked get the label.
    const ranked = [...candidates].sort((a, b) => (clicks.get(b.id) ?? 0) - (clicks.get(a.id) ?? 0));
    const popular = ranked.slice(0, SECTION_SIZE).map((p) => toCard(p, today, (clicks.get(p.id) ?? 0) > 0 ? "Popular" : undefined));

    // The top of the home page is for paid banners only, marked as sponsored. Promotions never appear there: they
    // have the rows below. Banners are shuffled on every visit, and when more are running than there are slots,
    // which ones appear is random too, so every advertiser gets the first slot and a place at all about equally
    // often. With no banner running, the top is left out.
    const hero = shuffle(running, random).slice(0, BANNER_SLOTS).map(toBannerSlide);
    // Featured places are limited per day. The row shows a few at a time and rotates, so every business
    // featured today appears about equally often.
    const featured = shuffle(featuredNow, random).slice(0, FEATURED_ROW_SIZE).map((p) => toCard(p, today, "Featured"));
    return {
      featured,
      hero,
      popular,
      newPlaces: businesses.map((b) => ({
        id: b.id,
        badge: "New",
        title: b.name,
        meta: [[b.town || b.dzongkhag].filter(Boolean).join("") || "Bhutan"],
        highlight: b.tagline,
        href: `/businesses/${b.slug}`,
        imageUrl: b.coverKey ? mediaUrl(b.coverKey) : b.logoKey ? mediaUrl(b.logoKey) : undefined,
      })),
      events: events.map((e) => toCard(e, today)),
    };
  },

  /** How much there is to find on Nook right now, for the About page. */
  siteStats: (now = new Date()) => repo.siteCounts(bhutanToday(now)),

  /** Every live deal (anything but an event), tagged for the Deals page filters. */
  async deals(now = new Date()): Promise<TaggedPromotion[]> {
    const today = bhutanToday(now);
    const started = { OR: [{ startsAt: null }, { startsAt: { lte: today } }] };
    const rows = await repo.livePromotions(today, { AND: [{ type: { not: "EVENT" } }, started] }, LIST_LIMIT, [{ createdAt: "desc" }]);
    return rows.map((p) => {
      const endsToday = p.endsAt !== null && p.endsAt.getTime() === today.getTime();
      return { ...toCard(p, today, endsToday ? "Ends today" : undefined), tags: dealTags({ ...p, category: p.category?.name ?? null }, today) };
    });
  },

  /** Live and upcoming events, soonest first, tagged for the Events page filters. */
  async events(now = new Date()): Promise<TaggedPromotion[]> {
    const today = bhutanToday(now);
    const rows = await repo.livePromotions(today, { type: "EVENT" }, LIST_LIMIT, [{ startsAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }]);
    return rows.map((p) => {
      const tags = eventTags({ ...p, category: p.category?.name ?? null }, today);
      return {
        ...toCard(p, today, tags.includes("weekend") ? "This weekend" : undefined),
        meta: [place(p.business), eventDateText(p.startsAt, p.endsAt)],
        tags,
      };
    });
  },

  /** Businesses, newest first, tagged for the New places page filters. */
  async newPlaces(now = new Date()): Promise<TaggedPromotion[]> {
    const rows = await repo.businessesWithCategories(LIST_LIMIT);
    return rows.map((b) => {
      const main = mainCategory(b.promotions.map((p) => p.category?.name ?? null));
      const area = b.town || b.dzongkhag;
      return {
        id: b.id,
        badge: now.getTime() - b.createdAt.getTime() <= 14 * DAY_MS ? "New" : undefined,
        title: b.name,
        meta: [[main, area].filter(Boolean).join(" · ") || "Bhutan", openedText(b.createdAt, now)],
        highlight: b.tagline,
        href: `/businesses/${b.slug}`,
        imageUrl: b.coverKey ? mediaUrl(b.coverKey) : b.logoKey ? mediaUrl(b.logoKey) : undefined,
        tags: placeTags(b.createdAt, main, now),
      };
    });
  },

  /**
   * A business's offers and events, sorted into current, upcoming and past for its public page.
   * Ended ones (and ones whose end date has passed) are "past"; ones that haven't started are "upcoming".
   */
  async businessActivity(businessId: string, now = new Date()): Promise<ActivityItem[]> {
    const today = bhutanToday(now);
    const rows = await repo.forBusiness(businessId);
    return rows.map((p) => {
      const ended = p.status === "ENDED" || (p.endsAt !== null && p.endsAt < today);
      const upcoming = !ended && p.startsAt !== null && p.startsAt > today;
      const status = ended ? "past" : upcoming ? "upcoming" : "current";
      const badge = status === "past" ? "Ended" : status === "upcoming" ? "Coming up" : p.type === "EVENT" ? "Happening now" : "Now on";
      return { ...toCard(p, today, badge), status };
    });
  },

  /** A live promotion for its page, or null (also for ended, draft and suspended-business promotions). */
  async promotionDetail(slug: string, now = new Date()): Promise<DetailData | null> {
    const today = bhutanToday(now);
    const p = await repo.findLiveBySlug(today, slug);
    if (!p) return null;

    // Events suggest other events; everything else suggests other deals.
    const more = await repo.livePromotions(today, { id: { not: p.id }, type: p.type === "EVENT" ? "EVENT" : { not: "EVENT" } }, 8, [{ createdAt: "desc" }]);
    // Others from the same business come first.
    const related = [...more].sort((a, b) => Number(b.businessId === p.businessId) - Number(a.businessId === p.businessId)).slice(0, 4);

    return buildDetail(p, related, today, now);
  },

  /**
   * An owner's own promotion (any status, so drafts can be previewed) for the dashboard preview. Links stay
   * inside the preview, because business owners don't browse the public site.
   */
  async previewDetail(ownerId: string, slug: string, now = new Date()): Promise<DetailData | null> {
    const today = bhutanToday(now);
    const p = await repo.findOwnedBySlug(ownerId, slug);
    if (!p) return null;

    const detail = buildDetail(p, await repo.ownedOthers(ownerId, p.id, 4), today, now);
    const inPreview = (card: PromotionCardData) => ({ ...card, href: card.href.replace(/^\/(promotions|events)\//, "/business/preview/") });
    return {
      ...detail,
      badge: p.status === "DRAFT" ? "Draft (only you can see this)" : p.status === "ENDED" ? "Ended" : detail.badge,
      shop: { ...detail.shop, href: "/business/preview" },
      related: detail.related.map(inPreview),
      back: { label: "Back to your page", href: "/business/preview" },
    };
  },
};
