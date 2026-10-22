import { bannerCost } from "@/lib/coins";
import { formatCoins } from "@/lib/formatters/number";
import { ANNOUNCEMENT, keyBelongsTo, mediaUrl } from "@/lib/media";
import { storage } from "@/lib/storage";
import { MAX_BANNER_DAYS, type AdminBannerInput, type BannerEditInput, type BannerInput } from "@/lib/validations/banner.schema";
import { bannerRepository } from "@/server/repositories/banner.repository";
import { InsufficientCoinsError } from "@/server/repositories/wallet.repository";
import { businessRepository } from "@/server/repositories/business.repository";
import { businessService, type Owner } from "@/services/business/business.service";
import { bhutanToday } from "@/services/discovery/discovery.service";

const DAY_MS = 86_400_000;

type Result = { ok: true } | { ok: false; error: string };

export type BannerStatus = "scheduled" | "active" | "ended" | "removed" | "pending" | "rejected";

export interface BannerRow {
  id: string;
  /** Whose banner it is. Shown to admins. */
  businessName: string;
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
  /** Why Nook didn't approve it. Empty unless it was turned down. */
  reviewNote: string;
  /** Coins given back if the owner deletes it now: all of them while it has never been approved, otherwise none. */
  refundable: number;
  views: number;
  clicks: number;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function statusOf(startsAt: Date, endsAt: Date, today: Date): "scheduled" | "active" | "ended" {
  if (endsAt < today) return "ended";
  return startsAt > today ? "scheduled" : "active";
}

/** Waiting for its first check: it has never been shown, so deleting it costs the business nothing. */
const neverApproved = (b: { review: string; reviewedAt: Date | null }) => b.review === "PENDING" && b.reviewedAt === null;

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
      imageKey: b.imageKey,
      startDate: iso(b.startsAt),
      endDate: iso(b.endsAt),
      days: Math.round((b.endsAt.getTime() - b.startsAt.getTime()) / DAY_MS) + 1,
      coins: b.coins,
      status: b.removedAt ? "removed" : b.review === "PENDING" ? "pending" : b.review === "REJECTED" ? "rejected" : statusOf(b.startsAt, b.endsAt, today),
      removed: b.removedAt !== null,
      reviewNote: b.reviewNote,
      refundable: neverApproved(b) ? b.coins : 0,
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
    const rows = await toRows(await bannerRepository.listAll(), now);
    // Banners waiting for a decision come first, oldest request first among them.
    const waiting = rows.filter((r) => r.status === "pending").reverse();
    return [...waiting, ...rows.filter((r) => r.status !== "pending")];
  },

  /** An admin approves a banner waiting for review, or turns it down with a reason (the coins go back to the business). */
  async review(actor: { id: string; email: string }, id: string, decision: "APPROVED" | "REJECTED", note: string, now = new Date()): Promise<Result> {
    if (decision === "REJECTED" && note.trim().length < 5) return { ok: false, error: "Write a short reason so the business knows what to change." };
    const done = await bannerRepository.review(id, decision, note.trim(), bhutanToday(now), actor);
    return done ? { ok: true } : { ok: false, error: "That banner isn't waiting for review any more." };
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
    if (banner.review === "REJECTED") return { ok: false, error: "Nook didn't approve this banner, so it can't be changed. Create a new banner instead." };
    if (banner.business.status === "SUSPENDED") return { ok: false, error: "Your business is suspended, so you can't change banners right now. Please contact us." };
    if (banner.endsAt < today) return { ok: false, error: "This banner has ended. Create a new one to run it again." };
    // The picture is the one it already has, or a file this business uploaded.
    if (input.imageKey !== banner.imageKey && !keyBelongsTo(input.imageKey, banner.business.id)) {
      return { ok: false, error: "That image isn't valid. Remove it and add it again." };
    }

    const extra = Number(input.extraDays);
    const runDays = Math.round((banner.endsAt.getTime() - banner.startsAt.getTime()) / DAY_MS) + 1;
    if (runDays + extra > MAX_BANNER_DAYS) return { ok: false, error: `A banner can run for up to ${MAX_BANNER_DAYS} days in total. It has ${runDays} now.` };

    // New words or a new picture have to be checked again before they show, so the approved version can't be swapped.
    const needsReview = input.title !== banner.title || input.description !== banner.description || input.imageKey !== banner.imageKey;
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
        { title: input.title, description: input.description, imageKey: input.imageKey, endsAt: new Date(banner.endsAt.getTime() + extra * DAY_MS), ...(needsReview ? { review: "PENDING" as const } : {}) },
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

  /**
   * Deletes one of the owner's banners. Nothing is refunded. A banner Nook took down, or one that has been
   * reported, stays on record: deleting it would erase what a report was about.
   */
  async remove(owner: Owner, id: string): Promise<Result> {
    const banner = await bannerRepository.findOwned(id, owner.id);
    if (!banner) return { ok: false, error: "We couldn't find that banner." };
    if (banner.removedAt) return { ok: false, error: "Nook took this banner down after a report, so it stays on record and can't be deleted." };
    if (banner.business.status === "SUSPENDED") return { ok: false, error: "Your business is suspended, so you can't change banners right now. Please contact us." };
    if ((await bannerRepository.reportCount(id)) > 0) {
      return { ok: false, error: "This banner has been reported, so it has to stay on record until it ends. Contact us if it needs to come down sooner." };
    }

    // A banner that was never approved was never shown, so what was paid for it goes back. (One sent for a second
    // check after an edit has already run, so it isn't refunded.)
    const refund = neverApproved(banner) ? { businessId: banner.business.id, coins: banner.coins, title: banner.title } : undefined;
    await bannerRepository.remove(
      id,
      { actorId: owner.id, actorEmail: owner.email, action: refund ? "banner.delete.refund" : "banner.delete", targetId: id, targetLabel: `Banner "${banner.title}" deleted${refund ? `, ${refund.coins} coins refunded` : ""}` },
      refund,
    );
    // The picture belonged only to this banner.
    await storage.remove(banner.imageKey);
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
