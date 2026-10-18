import type { ActivityItem } from "@/app/(public)/businesses/model/business.type";
import type { HeroSlideData } from "@/app/(public)/home/model/home.type";
import { CTA_TYPE_LABELS, TYPE_LABELS } from "@/lib/promotion-labels";
import { mediaUrl } from "@/lib/media";
import type { DetailData, ShopLine } from "@/components/public/model/detail.type";
import type { PromotionCardData } from "@/components/public/model/promotion.type";
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
const href = (slug: string) => `/promotions/${slug}`;

export function toCard(p: LivePromotion, today: Date, badge?: string): PromotionCardData {
  return {
    id: p.id,
    badge,
    title: p.title,
    meta: [place(p.business), validityText(p.startsAt, p.endsAt, today)],
    highlight: p.discount,
    href: href(p.slug),
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
    href: href(p.slug),
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

export interface Landing {
  hero: HeroSlideData[];
  popular: PromotionCardData[];
  newPlaces: PromotionCardData[];
  events: PromotionCardData[];
}

const POPULAR_WINDOW_DAYS = 14;
const SECTION_SIZE = 6;
const HERO_SIZE = 4;
const MAX_BANNERS = 4;

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

    return {
      kind: "promotion",
      slug: p.slug,
      title: p.title,
      badge: TYPE_LABELS[p.type],
      highlight: p.discount || TYPE_LABELS[p.type],
      facts: [
        { label: "Offer", value: p.discount || "—" },
        { label: "Valid", value: validityText(p.startsAt, p.endsAt, today) },
        { label: "Where", value: p.location || [b.town, b.dzongkhag].filter(Boolean).join(", ") || "—" },
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
  async landing(now = new Date()): Promise<Landing> {
    const today = bhutanToday(now);
    const started = { OR: [{ startsAt: null }, { startsAt: { lte: today } }] };

    const [candidates, events, businesses] = await Promise.all([
      repo.livePromotions(today, { AND: [{ type: { not: "EVENT" } }, started] }, 30, [{ createdAt: "desc" }]),
      repo.livePromotions(today, { type: "EVENT" }, SECTION_SIZE, [{ startsAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }]),
      repo.newBusinesses(SECTION_SIZE),
    ]);

    // "Popular" = most clicks lately, newest first among ties. Only promotions people actually clicked get the label.
    const clicks = await repo.clicksSince(candidates.map((c) => c.id), new Date(now.getTime() - POPULAR_WINDOW_DAYS * DAY_MS));
    const ranked = [...candidates].sort((a, b) => (clicks.get(b.id) ?? 0) - (clicks.get(a.id) ?? 0));
    const popular = ranked.slice(0, SECTION_SIZE).map((p) => toCard(p, today, (clicks.get(p.id) ?? 0) > 0 ? "Popular" : undefined));

    // Paid banners come first, marked as sponsored. Promotions fill the rest.
    const banners = (await bannerRepository.active(today)).slice(0, MAX_BANNERS).map(toBannerSlide);
    const heroSource = [...events.slice(0, 1), ...ranked].filter((p, i, all) => all.findIndex((q) => q.id === p.id) === i);
    return {
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

    const more = await repo.livePromotions(today, { id: { not: p.id } }, 8, [{ createdAt: "desc" }]);
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
    const inPreview = (card: PromotionCardData) => ({ ...card, href: card.href.replace("/promotions/", "/business/preview/") });
    return {
      ...detail,
      badge: p.status === "DRAFT" ? "Draft (only you can see this)" : p.status === "ENDED" ? "Ended" : detail.badge,
      shop: { ...detail.shop, href: "/business/preview" },
      related: detail.related.map(inPreview),
      back: { label: "Back to your page", href: "/business/preview" },
    };
  },
};
