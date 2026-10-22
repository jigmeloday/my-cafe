import { bannerCost } from "@/lib/coins";
import { formatCoins } from "@/lib/formatters/number";
import { ANNOUNCEMENT, keyBelongsTo, mediaUrl } from "@/lib/media";
import type { AdminBannerInput, BannerInput } from "@/lib/validations/banner.schema";
import { bannerRepository } from "@/server/repositories/banner.repository";
import { InsufficientCoinsError } from "@/server/repositories/wallet.repository";
import { businessRepository } from "@/server/repositories/business.repository";
import { businessService, type Owner } from "@/services/business/business.service";
import { bhutanToday } from "@/services/discovery/discovery.service";

const DAY_MS = 86_400_000;

type Result = { ok: true } | { ok: false; error: string };

export type BannerStatus = "scheduled" | "active" | "ended" | "removed";

export interface BannerRow {
  id: string;
  /** Whose banner it is. Shown to admins. */
  businessName: string;
  title: string;
  description: string;
  imageUrl: string;
  /** "YYYY-MM-DD", first and last day shown. */
  startDate: string;
  endDate: string;
  days: number;
  coins: number;
  status: BannerStatus;
  views: number;
  clicks: number;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function statusOf(startsAt: Date, endsAt: Date, today: Date): Exclude<BannerStatus, "removed"> {
  if (endsAt < today) return "ended";
  return startsAt > today ? "scheduled" : "active";
}

type BannerRecord = Awaited<ReturnType<typeof bannerRepository.listAll>>[number];

async function toRows(rows: BannerRecord[], now: Date): Promise<BannerRow[]> {
  const today = bhutanToday(now);
  const totals = await bannerRepository.eventTotals(rows.map((r) => r.id));
  return rows.map((b) => ({
      id: b.id,
      businessName: b.business?.name ?? "Announcement",
      title: b.title,
      description: b.description,
      imageUrl: mediaUrl(b.imageKey),
      startDate: iso(b.startsAt),
      endDate: iso(b.endsAt),
      days: Math.round((b.endsAt.getTime() - b.startsAt.getTime()) / DAY_MS) + 1,
      coins: b.coins,
      status: b.removedAt ? "removed" : statusOf(b.startsAt, b.endsAt, today),
      views: totals.get(b.id)?.views ?? 0,
      clicks: totals.get(b.id)?.clicks ?? 0,
  }));
}

export const bannerService = {
  /** The owner's banners, newest first, with how they're doing. */
  async list(ownerId: string, now = new Date()): Promise<BannerRow[]> {
    return toRows(await bannerRepository.listByOwner(ownerId), now);
  },

  /** Every banner on the site, for the admin. */
  async listAll(now = new Date()): Promise<BannerRow[]> {
    return toRows(await bannerRepository.listAll(), now);
  },

  /** Businesses a banner can be made for. */
  businessOptions: () => bannerRepository.businessOptions(),

  /** An admin takes a banner down. It stops showing at once; coins the business paid are not given back, and nothing is charged. */
  async takeDown(actor: { id: string; email: string }, id: string): Promise<Result> {
    const done = await bannerRepository.takeDown(id, actor);
    return done ? { ok: true } : { ok: false, error: "That banner is already down or no longer exists." };
  },

  /** An admin makes a banner, for a business or as an announcement for the whole site. It costs nothing. */
  async createByAdmin(actor: { id: string; email: string }, input: AdminBannerInput, now = new Date()): Promise<Result> {
    const today = bhutanToday(now);
    const startsAt = new Date(`${input.startDate}T00:00:00Z`);
    if (Number.isNaN(startsAt.getTime()) || startsAt < today) return { ok: false, error: "Choose today or a later day to start." };

    const announcement = input.businessId === ANNOUNCEMENT;
    const business = announcement ? null : await businessRepository.findById(input.businessId);
    if (!announcement && !business) return { ok: false, error: "We couldn't find that business." };
    if (business?.status === "SUSPENDED") return { ok: false, error: "That business is suspended." };
    // The image must be a file sent for this business (or for announcements).
    if (!keyBelongsTo(input.imageKey, business?.id ?? ANNOUNCEMENT)) return { ok: false, error: "That image isn't valid. Remove it and add it again." };

    await bannerRepository.createByAdmin(
      {
        businessId: business?.id ?? null,
        title: input.title,
        description: input.description,
        imageKey: input.imageKey,
        // An announcement leads where the admin says; a business banner leads to the business page.
        linkUrl: announcement ? input.linkUrl : "",
        startsAt,
        endsAt: new Date(startsAt.getTime() + (Number(input.days) - 1) * DAY_MS),
      },
      actor,
    );
    return { ok: true };
  },

  /** Creates a banner and pays for it from the wallet. Nothing is charged unless the banner is saved. */
  async create(owner: Owner, input: BannerInput, now = new Date()): Promise<Result> {
    const today = bhutanToday(now);
    const startsAt = new Date(`${input.startDate}T00:00:00Z`);
    if (Number.isNaN(startsAt.getTime()) || startsAt < today) return { ok: false, error: "Choose today or a later day to start." };

    const business = await businessService.ensure(owner);
    if (business.status === "SUSPENDED") return { ok: false, error: "Your business is suspended, so you can't create banners right now. Please contact us." };
    // The image must be a file this business uploaded.
    if (!keyBelongsTo(input.imageKey, business.id)) return { ok: false, error: "That image isn't valid. Remove it and add it again." };

    const days = Number(input.days);
    try {
      await bannerRepository.create({
        businessId: business.id,
        // A banner opens the business page, never a single promotion. (Older banners may still point at one.)
        promotionId: null,
        title: input.title,
        description: input.description,
        imageKey: input.imageKey,
        startsAt,
        endsAt: new Date(startsAt.getTime() + (days - 1) * DAY_MS),
        coins: bannerCost(days),
      });
      return { ok: true };
    } catch (error) {
      if (error instanceof InsufficientCoinsError) {
        return { ok: false, error: `This banner costs ${formatCoins(error.needed)} and you have ${formatCoins(error.balance)}. Buy more coins first.` };
      }
      throw error;
    }
  },
};
