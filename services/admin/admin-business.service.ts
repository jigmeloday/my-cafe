import type { Prisma } from "@/generated/prisma/client";
import { clampPage, totalPagesFor } from "@/lib/pagination";
import { escapeLike, parseSearch } from "@/lib/search";
import { adminBusinessRepository as repo, type BusinessRowData } from "@/server/repositories/admin-business.repository";
import type { AdminBusinessRow, BusinessFilter, BusinessListQuery, BusinessListResult, VerificationState } from "@/types/admin-business";

import type { Actor } from "./admin-user.service";

export const BUSINESSES_PAGE_SIZE = 10;

const isoDate = (d: Date) => d.toISOString().slice(0, 10);
type Outcome = { ok: true; message: string } | { ok: false; error: string };

/** Every word typed must match the business name, its owner's name or email, or its town or area (any order, any case). */
export function buildBusinessWhere({ q, filter }: Pick<BusinessListQuery, "q" | "filter">): Prisma.BusinessWhereInput {
  const { words } = parseSearch(q);
  const search = words.map((word) => {
    const text = escapeLike(word);
    return {
      OR: [
        { name: { contains: text, mode: "insensitive" as const } },
        { town: { contains: text, mode: "insensitive" as const } },
        { dzongkhag: { contains: text, mode: "insensitive" as const } },
        { owner: { is: { name: { contains: text, mode: "insensitive" as const } } } },
        { owner: { is: { email: { contains: text, mode: "insensitive" as const } } } },
      ],
    };
  });
  return { AND: [filter === "ALL" ? {} : { status: filter }, ...search] };
}

function verificationOf(b: BusinessRowData): VerificationState {
  const latest = b.kycSubmissions[0]?.status;
  if (latest === "PENDING") return "WAITING";
  if (latest === "REJECTED") return "SENT_BACK";
  if (latest === "APPROVED" || b.status === "VERIFIED") return "APPROVED";
  return "NONE";
}

const entry = (actor: Actor, id: string, name: string, action: "business.verify" | "business.suspend" | "business.reinstate") => ({
  actorId: actor.id,
  actorEmail: actor.email,
  action,
  targetId: id,
  targetLabel: name,
});

export const adminBusinessService = {
  async list(query: BusinessListQuery, pageSize = BUSINESSES_PAGE_SIZE): Promise<BusinessListResult> {
    const where = buildBusinessWhere(query);
    const [total, grouped] = await Promise.all([repo.count(where), repo.countsByStatus()]);
    const totalPages = totalPagesFor(total, pageSize);
    const page = clampPage(query.page, totalPages);
    const rows = await repo.list(where, (page - 1) * pageSize, pageSize);
    const followers = await repo.followerCounts(rows.map((b) => `/businesses/${b.slug}`));

    const byStatus = Object.fromEntries(grouped.map((g) => [g.status, g._count._all]));
    const counts: Record<BusinessFilter, number> = {
      ALL: grouped.reduce((sum, g) => sum + g._count._all, 0),
      PENDING: byStatus.PENDING ?? 0,
      VERIFIED: byStatus.VERIFIED ?? 0,
      SUSPENDED: byStatus.SUSPENDED ?? 0,
    };

    const items: AdminBusinessRow[] = rows.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      ownerName: b.owner.name,
      ownerEmail: b.owner.email,
      town: b.town,
      dzongkhag: b.dzongkhag,
      status: b.status,
      livePromotions: b._count.promotions,
      followers: followers.get(`/businesses/${b.slug}`) ?? 0,
      verification: verificationOf(b),
      waitingRequestId: b.kycSubmissions[0]?.status === "PENDING" ? b.kycSubmissions[0].id : null,
      joined: isoDate(b.createdAt),
    }));
    return { items, total, page, pageSize, totalPages, counts };
  },

  /** Hides a business and everything it posted from the public site. The owner is told why. */
  async suspend(actor: Actor, id: string, reason: string): Promise<Outcome> {
    const b = await repo.findById(id);
    if (!b) return { ok: false, error: "That business no longer exists." };
    if (b.status === "SUSPENDED") return { ok: false, error: "It's already suspended." };

    const done = await repo.setStatus({
      id,
      from: b.status,
      to: "SUSPENDED",
      audit: entry(actor, id, b.name, "business.suspend"),
      notice: { userId: b.owner.id, title: "Your business was suspended", description: `${b.name} is hidden from Nook for now. Reason: ${reason} Contact us if you'd like to talk about it.`, href: "/business/dashboard" },
    });
    return done ? { ok: true, message: `${b.name} is suspended and hidden from the public.` } : { ok: false, error: "Someone just changed this business. Refresh and try again." };
  },

  /** Brings a suspended business back: verified again if it had been approved, otherwise as before. */
  async reinstate(actor: Actor, id: string): Promise<Outcome> {
    const b = await repo.findById(id);
    if (!b) return { ok: false, error: "That business no longer exists." };
    if (b.status !== "SUSPENDED") return { ok: false, error: "It isn't suspended." };

    const done = await repo.setStatus({
      id,
      from: "SUSPENDED",
      to: b.kycSubmissions.length > 0 ? "VERIFIED" : "PENDING",
      audit: entry(actor, id, b.name, "business.reinstate"),
      notice: { userId: b.owner.id, title: "Your business is back", description: `${b.name} is visible on Nook again.`, href: "/business/dashboard" },
    });
    return done ? { ok: true, message: `${b.name} is visible again.` } : { ok: false, error: "Someone just changed this business. Refresh and try again." };
  },

  /** Verifies a business by hand, without documents. The normal way is the Verification queue. */
  async verify(actor: Actor, id: string): Promise<Outcome> {
    const b = await repo.findById(id);
    if (!b) return { ok: false, error: "That business no longer exists." };
    if (b.status !== "PENDING") return { ok: false, error: b.status === "VERIFIED" ? "It's already verified." : "Reinstate it first." };

    const done = await repo.setStatus({
      id,
      from: "PENDING",
      to: "VERIFIED",
      audit: entry(actor, id, b.name, "business.verify"),
      notice: { userId: b.owner.id, title: "Your business is verified", description: "Your business now shows the Verified badge on Nook.", href: "/business/verification" },
    });
    return done ? { ok: true, message: `${b.name} is verified.` } : { ok: false, error: "Someone just changed this business. Refresh and try again." };
  },
};
