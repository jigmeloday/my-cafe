import type { ActivityItem } from "@/app/(public)/businesses/model/business.type";
import type { HeroSlideData } from "@/app/(public)/home/model/home.type";
import { CTA_TYPE_LABELS, TYPE_LABELS } from "@/lib/promotion-labels";
import { mediaUrl } from "@/lib/media";
import type { DetailData, ShopLine } from "@/components/public/model/detail.type";
import type { PromotionCardData, TaggedPromotion } from "@/components/public/model/promotion.type";
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

export function toSlide(p: LivePromotion): HeroSlideData {
  const where = [p.business.name, p.business.town || p.business.dzongkhag].filter(Boolean).join(" · ");
  return {
    id: p.id,
    eyebrow: TYPE_LABELS[p.type],
    title: p.title,
    description: [p.discount, where].filter(Boolean).join(" — "),
    cta: "View offer",
    href: href(p.slug, p.type),
    imageLabel: p.title,
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
const HERO_SIZE = 4;
/** How many paid banners the home page shows at once. Raise it as more businesses buy banners. */
export const BANNER_SLOTS = 4;

/** The page data for one promotion. Shared by the public page and the owner's preview. */
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
      cta: p.ctaType === "VISIT_WEBSITE" && p.ctaUrl ? { label: CTA_TYPE_LABELS.VISIT_WEBSITE, href: p.ctaUrl } : p.ctaType === "CONTACT_BUSINESS" && b.phone ? { label: CTA_TYPE_LABELS.CONTACT_BUSINESS, href: `tel:${b.phone.replace(/\s/g, "")}` } : undefined,
      shopLines: lines,
      shopLogo: b.logoKey ? mediaUrl(b.logoKey) : undefined,
    };
}

export const discoveryService = {
  /** Everything the home page shows. Sections with nothing in them are simply empty. */
  async landing(now = new Date(), random: () => number = Math.random): Promise<Landing> {
    const today = bhutanToday(now);
    const started = { OR: [{ startsAt: null }, { startsAt: { lte: today } }] };

    const [candidates, events, businesses, featuredNow] = await Promise.all([
      repo.livePromotions(today, { AND: [{ type: { not: "EVENT" } }, started] }, 30, [{ createdAt: "desc" }]),
      repo.livePromotions(today, { type: "EVENT" }, SECTION_SIZE, [{ startsAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }]),
      repo.newBusinesses(SECTION_SIZE),
      repo.featuredToday(today),
    ]);

    // "Popular" = most clicks lately, newest first among ties. Only promotions people actually clicked get the label.
    const clicks = await repo.clicksSince(candidates.map((c) => c.id), new Date(now.getTime() - POPULAR_WINDOW_DAYS * DAY_MS));
    const ranked = [...candidates].sort((a, b) => (clicks.get(b.id) ?? 0) - (clicks.get(a.id) ?? 0));
    const popular = ranked.slice(0, SECTION_SIZE).map((p) => toCard(p, today, (clicks.get(p.id) ?? 0) > 0 ? "Popular" : undefined));

    // Paid banners come first, marked as sponsored. They are shuffled on every visit, and when more are running
    // than there are slots, which ones appear is random too, so every advertiser gets the first slot and a
    // place at all about equally often. Promotions fill the rest.
    const banners = shuffle(await bannerRepository.active(today), random).slice(0, BANNER_SLOTS).map(toBannerSlide);
    const heroSource = [...events.slice(0, 1), ...ranked].filter((p, i, all) => all.findIndex((q) => q.id === p.id) === i);
    // Featured places are limited per day. The row shows a few at a time and rotates, so every business
    // featured today appears about equally often.
    const featured = shuffle(featuredNow, random).slice(0, FEATURED_ROW_SIZE).map((p) => toCard(p, today, "Featured"));
    return {
      featured,
      hero: [...banners, ...heroSource.slice(0, Math.max(HERO_SIZE - banners.length, 1)).map(toSlide)],
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
