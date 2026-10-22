import { bannerCost } from "@/lib/coins";
import { formatCoins } from "@/lib/formatters/number";
import { keyBelongsTo, mediaUrl } from "@/lib/media";
import type { BannerInput } from "@/lib/validations/banner.schema";
import { bannerRepository } from "@/server/repositories/banner.repository";
import { InsufficientCoinsError } from "@/server/repositories/wallet.repository";
import { businessService, type Owner } from "@/services/business/business.service";
import { bhutanToday } from "@/services/discovery/discovery.service";

const DAY_MS = 86_400_000;

type Result = { ok: true } | { ok: false; error: string };

export type BannerStatus = "scheduled" | "active" | "ended";

export interface BannerRow {
  id: string;
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

export function statusOf(startsAt: Date, endsAt: Date, today: Date): BannerStatus {
  if (endsAt < today) return "ended";
  return startsAt > today ? "scheduled" : "active";
}

export const bannerService = {
  /** The owner's banners, newest first, with how they're doing. */
  async list(ownerId: string, now = new Date()): Promise<BannerRow[]> {
    const today = bhutanToday(now);
    const rows = await bannerRepository.listByOwner(ownerId);
    const totals = await bannerRepository.eventTotals(rows.map((r) => r.id));
    return rows.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      imageUrl: mediaUrl(b.imageKey),
      startDate: iso(b.startsAt),
      endDate: iso(b.endsAt),
      days: Math.round((b.endsAt.getTime() - b.startsAt.getTime()) / DAY_MS) + 1,
      coins: b.coins,
      status: statusOf(b.startsAt, b.endsAt, today),
      views: totals.get(b.id)?.views ?? 0,
      clicks: totals.get(b.id)?.clicks ?? 0,
    }));
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
