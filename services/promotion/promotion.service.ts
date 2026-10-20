import { randomBytes } from "node:crypto";

import { keyBelongsTo } from "@/lib/media";
import { storage } from "@/lib/storage";
import { COIN_COSTS } from "@/lib/coins";
import { daysOfRun, FEATURED_HORIZON_DAYS, featuredPrice } from "@/lib/featured";
import { formatCoins } from "@/lib/formatters/number";
import type { Promotion } from "@/generated/prisma/client";
import { slugify } from "@/lib/slug";
import type { PromotionInput } from "@/lib/validations/promotion.schema";
import type { PromotionItem } from "@/app/(business)/business/promotions/model/promotion.type";
import { FeaturedFullError, FeaturedOverlapError, type FeaturedRequest } from "@/server/repositories/featured.repository";
import { InsufficientCoinsError, walletRepository } from "@/server/repositories/wallet.repository";
import { promotionRepository } from "@/server/repositories/promotion.repository";
import { bhutanToday } from "@/services/discovery/discovery.service";
import { businessService, type Owner } from "@/services/business/business.service";

type Result = { ok: true } | { ok: false; error: string };
const NOT_FOUND: Result = { ok: false, error: "We couldn't find that promotion." };

const toDateOnly = (date: Date | null) => (date ? date.toISOString().slice(0, 10) : "");
const fromDateOnly = (value: string) => (value ? new Date(`${value}T00:00:00Z`) : null);

/** A readable, unique address for the promotion's page: "20-off-kira", then "20-off-kira-4f9a" if taken. */
async function uniqueSlug(title: string) {
  const base = slugify(title, "promotion", 50);
  return (await promotionRepository.slugTaken(base)) ? `${base}-${randomBytes(2).toString("hex")}` : base;
}

const publishCharge = (title: string) => ({ amount: COIN_COSTS.publish, description: `Published: ${title}` });

const SUSPENDED = "Your business is suspended, so you can't publish or change promotions right now. Please contact us.";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CTA_TYPES = ["VIEW_OFFER", "VISIT_WEBSITE", "CONTACT_BUSINESS"] as const;

function toItem(p: Promotion): PromotionItem {
  return {
    id: p.id,
    status: p.status,
    // Clicks and paid placements aren't tracked yet.
    clicks: 0,
    boosted: false,
    values: {
      title: p.title,
      type: p.type,
      discount: p.discount,
      description: p.description,
      startDate: toDateOnly(p.startsAt),
      endDate: toDateOnly(p.endsAt),
      location: p.location,
      category: p.categoryId ?? "",
      ctaType: CTA_TYPES.find((t) => t === p.ctaType) ?? "VIEW_OFFER",
      ctaUrl: p.ctaUrl,
      photos: p.photos,
      featureDays: "0",
      featureStart: "",
      status: p.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    },
    removed: p.removedAt !== null,
  };
}

export const promotionService = {
  /** The owner's promotions, newest first, in the shape the listing shows. */
  async list(ownerId: string): Promise<PromotionItem[]> {
    return (await promotionRepository.listByOwner(ownerId)).map(toItem);
  },

  /** One of the owner's promotions, for the edit page. */
  async get(ownerId: string, id: string): Promise<PromotionItem | null> {
    const row = await promotionRepository.findOwned(id, ownerId);
    return row ? toItem(row) : null;
  },

  /** Creates a promotion (no `id`) or updates the owner's own. Going live costs the publish fee, once. */
  async save(owner: Owner, input: PromotionInput, id?: string): Promise<Result> {
    if (input.category && !(await promotionRepository.categoryExists(input.category))) {
      return { ok: false, error: "That category no longer exists. Pick another one." };
    }

    const data = {
      title: input.title,
      type: input.type,
      status: input.status,
      discount: input.discount,
      description: input.description,
      location: input.location,
      categoryId: input.category || null,
      startsAt: fromDateOnly(input.startDate),
      endsAt: fromDateOnly(input.endDate),
      ctaType: input.ctaType,
      ctaUrl: input.ctaType === "VISIT_WEBSITE" ? input.ctaUrl : "",
      photos: [...new Set(input.photos)],
    };

    // Featuring is booked together with going live (or on an already live promotion), and paid on top.
    const days = Number(input.featureDays);
    let featured: FeaturedRequest | undefined;
    if (days > 0) {
      const today = bhutanToday().toISOString().slice(0, 10);
      if (input.featureStart < today) return { ok: false, error: "Choose today or a later day to start featuring." };
      if (input.featureStart > daysOfRun(today, FEATURED_HORIZON_DAYS).at(-1)!) return { ok: false, error: `You can book up to ${FEATURED_HORIZON_DAYS} days ahead.` };
      featured = { start: input.featureStart, days, coins: featuredPrice(days), title: input.title };
    }

    try {
      const business = await businessService.ensure(owner);
      if (business.status === "SUSPENDED") return { ok: false, error: SUSPENDED };
      // Photos must be files this business uploaded, never someone else's.
      if (!data.photos.every((key) => keyBelongsTo(key, business.id))) {
        return { ok: false, error: "One of the photos isn't valid. Remove it and add it again." };
      }

      if (id) {
        const before = await promotionRepository.findOwned(id, owner.id);
        if (!before) return NOT_FOUND;
        if (before.removedAt) return { ok: false, error: "Nook took this promotion down after a report, so it can't be changed or republished. Contact us if you think this is a mistake." };
        // Going live costs coins, but editing something already live is free.
        const charge = input.status === "PUBLISHED" && before.status !== "PUBLISHED" ? publishCharge(input.title) : undefined;
        if (!(await promotionRepository.update(id, owner.id, data, charge, featured))) return NOT_FOUND;
        // Photos taken off the promotion are no longer needed.
        await Promise.all(before.photos.filter((key) => !data.photos.includes(key)).map((key) => storage.remove(key)));
        return { ok: true };
      }

      const charge = input.status === "PUBLISHED" ? publishCharge(input.title) : undefined;
      await promotionRepository.create({ ...data, businessId: business.id, slug: await uniqueSlug(input.title) }, charge, featured);
      return { ok: true };
    } catch (error) {
      if (error instanceof FeaturedFullError) {
        const list = error.days.map((d) => `${Number(d.slice(8))} ${MONTHS[Number(d.slice(5, 7)) - 1]}`).join(", ");
        return { ok: false, error: `Featured places are full on ${list}. Choose other days, or publish without featuring.` };
      }
      if (error instanceof FeaturedOverlapError) return { ok: false, error: "This promotion is already featured on some of those days." };
      if (error instanceof InsufficientCoinsError) {
        // Everything was rolled back, so the wallet still holds what it did. Say what the whole thing costs.
        const business = await businessService.ensure(owner);
        const balance = await walletRepository.balance(business.id);
        const total = error.needed;
        return {
          ok: false,
          error: featured
            ? `This costs more than you have (${formatCoins(balance)}). Publishing is ${formatCoins(COIN_COSTS.publish)} and featuring is ${formatCoins(featured.coins)}. Buy more coins, or turn off featuring.`
            : `Publishing costs ${formatCoins(total)} and you have ${formatCoins(balance)}. Buy more coins, or save it as a draft.`,
        };
      }
      throw error;
    }
  },

  async end(ownerId: string, id: string): Promise<Result> {
    return (await promotionRepository.end(id, ownerId)) ? { ok: true } : NOT_FOUND;
  },

  async remove(ownerId: string, id: string): Promise<Result> {
    const before = await promotionRepository.findOwned(id, ownerId);
    if (!before || !(await promotionRepository.remove(id, ownerId))) return NOT_FOUND;
    await Promise.all(before.photos.map((key) => storage.remove(key)));
    return { ok: true };
  },
};
