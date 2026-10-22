import { bannerCost } from "@/lib/coins";
import { formatCoins } from "@/lib/formatters/number";
import { keyBelongsTo, mediaUrl } from "@/lib/media";
import { storage } from "@/lib/storage";
import { MAX_BANNER_DAYS, type BannerEditInput, type BannerInput } from "@/lib/validations/banner.schema";
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
  /** The stored file's name, to tell a changed picture from the saved one. */
  imageKey: string;
  /** "YYYY-MM-DD", first and last day shown. */
  startDate: string;
  endDate: string;
  days: number;
  coins: number;
  status: BannerStatus;
  /** Taken down by Nook after a report: it can't be edited. */
  removed: boolean;
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
      imageKey: b.imageKey,
      startDate: iso(b.startsAt),
      endDate: iso(b.endsAt),
      days: Math.round((b.endsAt.getTime() - b.startsAt.getTime()) / DAY_MS) + 1,
      coins: b.coins,
      status: statusOf(b.startsAt, b.endsAt, today),
      removed: b.removedAt !== null,
      views: totals.get(b.id)?.views ?? 0,
      clicks: totals.get(b.id)?.clicks ?? 0,
    }));
  },

  /** One of the owner's banners, for the edit page. Null when it doesn't exist. */
  async get(ownerId: string, id: string, now = new Date()): Promise<BannerRow | null> {
    return (await this.list(ownerId, now)).find((b) => b.id === id) ?? null;
  },

  /**
   * Changes a banner's headline, text and picture (free), and optionally adds days at the end (paid, only the new
   * days). Start and end dates already running can't be moved, and nothing is refunded for shortening.
   */
  async update(owner: Owner, id: string, input: BannerEditInput, now = new Date()): Promise<Result> {
    const today = bhutanToday(now);
    const banner = await bannerRepository.findOwned(id, owner.id);
    if (!banner) return { ok: false, error: "We couldn't find that banner." };
    if (banner.removedAt) return { ok: false, error: "Nook took this banner down after a report, so it can't be changed. Contact us if you think this is a mistake." };
    if (banner.business.status === "SUSPENDED") return { ok: false, error: "Your business is suspended, so you can't change banners right now. Please contact us." };
    if (banner.endsAt < today) return { ok: false, error: "This banner has ended. Create a new one to run it again." };
    // The picture is the one it already has, or a file this business uploaded.
    if (input.imageKey !== banner.imageKey && !keyBelongsTo(input.imageKey, banner.business.id)) {
      return { ok: false, error: "That image isn't valid. Remove it and add it again." };
    }

    const extra = Number(input.extraDays);
    const runDays = Math.round((banner.endsAt.getTime() - banner.startsAt.getTime()) / DAY_MS) + 1;
    if (runDays + extra > MAX_BANNER_DAYS) return { ok: false, error: `A banner can run for up to ${MAX_BANNER_DAYS} days in total. It has ${runDays} now.` };

    const changes = [
      input.title !== banner.title && "headline",
      input.description !== banner.description && "text",
      input.imageKey !== banner.imageKey && "image",
      extra > 0 && `+${extra} days`,
    ].filter(Boolean);
    try {
      await bannerRepository.update(
        id,
        banner.business.id,
        { title: input.title, description: input.description, imageKey: input.imageKey, endsAt: new Date(banner.endsAt.getTime() + extra * DAY_MS) },
        bannerCost(extra),
        // A record of what changed on a paid ad, so a swapped picture or text can be looked into.
        { actorId: owner.id, actorEmail: owner.email, action: "banner.edit", targetId: id, targetLabel: `Banner "${input.title}": ${changes.join(", ") || "no change"}` },
      );
    } catch (error) {
      if (error instanceof InsufficientCoinsError) {
        return { ok: false, error: `Adding those days costs ${formatCoins(error.needed)} and you have ${formatCoins(error.balance)}. Buy more coins first.` };
      }
      throw error;
    }
    // The old picture is no longer used by anything.
    if (input.imageKey !== banner.imageKey) await storage.remove(banner.imageKey);
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
