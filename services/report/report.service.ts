import type { ReportDecision, ReportReason } from "@/generated/prisma/enums";
import { REASON_LABEL, REPORTS_PER_HOUR, type ReportReasonId } from "@/lib/report-reasons";
import type { ReportInput, ResolveInput } from "@/lib/validations/report.schema";
import { reportRepository, type ReportRow } from "@/server/repositories/report.repository";
import { rateLimit } from "@/services/auth/rate-limit.service";
import { bhutanToday } from "@/services/discovery/discovery.service";

type Result = { ok: true; message: string } | { ok: false; error: string };

const MINUTE = 60_000;
const REPORT_LIMIT = { max: REPORTS_PER_HOUR, windowMs: 60 * MINUTE } as const;

/** One card in the admin queue: every report about the same ad and status, together. */
export interface ReportItem {
  /** Unique per card, e.g. "promotion:abc:OPEN". */
  id: string;
  kind: "promotion" | "banner";
  targetId: string;
  title: string;
  businessName: string;
  /** Where to look at the ad, or null when there's no public page for it. */
  href: string | null;
  reason: ReportReason;
  /** The most recent note someone wrote. */
  details: string;
  count: number;
  /** "YYYY-MM-DDTHH:mm" in Bhutan time. */
  firstReported: string;
  status: "OPEN" | "RESOLVED";
  decision?: ReportDecision;
  /** The ad has already been taken down. */
  removed: boolean;
}

const toBhutan = (d: Date) => new Date(d.getTime() + 6 * 3_600_000).toISOString().slice(0, 16);

/** The reason most reports gave (ties go to the earlier one). */
function commonReason(rows: ReportRow[]): ReportReason {
  const counts = new Map<ReportReason, number>();
  rows.forEach((r) => counts.set(r.reason, (counts.get(r.reason) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** Groups reports (oldest first) into one card per ad and status. */
export function groupReports(rows: ReportRow[]): ReportItem[] {
  const groups = new Map<string, ReportRow[]>();
  for (const r of rows) {
    const key = `${r.promotionId ? `promotion:${r.promotionId}` : `banner:${r.bannerId}`}:${r.status}`;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  return [...groups.entries()].map(([id, list]) => {
    const first = list[0];
    const promotion = first.promotion;
    const banner = first.banner;
    const latestNote = [...list].reverse().find((r) => r.details)?.details ?? "";
    return {
      id,
      kind: promotion ? ("promotion" as const) : ("banner" as const),
      targetId: (promotion?.id ?? banner?.id) as string,
      title: promotion?.title ?? banner?.title ?? "Removed ad",
      businessName: (promotion?.business.name ?? banner?.business?.name) ?? "",
      href: promotion ? (promotion.type === "EVENT" ? `/events/${promotion.slug}` : `/promotions/${promotion.slug}`) : banner?.business ? `/businesses/${banner.business.slug}` : null,
      reason: commonReason(list),
      details: latestNote,
      count: list.length,
      firstReported: toBhutan(first.createdAt),
      status: first.status,
      decision: list.find((r) => r.decision)?.decision ?? undefined,
      removed: !!(promotion?.removedAt ?? banner?.removedAt),
    };
  }).sort((a, b) => (a.firstReported < b.firstReported ? 1 : -1));
}

export const reportService = {
  /** A signed-in customer reports a promotion or a running banner. One report each, and a limit per hour. */
  async report(reporterId: string, input: ReportInput, now = new Date()): Promise<Result> {
    const key = `report:user:${reporterId}`;
    if (await rateLimit.isBlocked(key, REPORT_LIMIT, now)) return { ok: false, error: "You've sent a lot of reports. Please wait a while before sending more." };

    const reportable = input.promotionId
      ? await reportRepository.promotionReportable(input.promotionId)
      : await reportRepository.bannerReportable(input.bannerId as string, bhutanToday(now));
    if (!reportable) return { ok: false, error: "This ad isn't available to report any more." };

    await rateLimit.record(key, now);
    const created = await reportRepository.create({ reporterId, promotionId: input.promotionId, bannerId: input.bannerId, reason: input.reason, details: input.details });
    if (!created) return { ok: false, error: "You've already reported this ad. Thank you, we're looking at it." };
    return { ok: true, message: "Thank you. We'll review this ad." };
  },

  /** Messages from Nook to a business owner (warnings, removals) from the last 30 days, newest first. */
  async noticesFor(ownerId: string, now = new Date()) {
    const rows = await reportRepository.noticesFor(ownerId, new Date(now.getTime() - 30 * 86_400_000));
    return rows.map((n) => ({ id: n.id, title: n.title, description: n.description, href: n.href, at: toBhutan(n.createdAt) }));
  },

  async list(status: "OPEN" | "RESOLVED" | "ALL"): Promise<ReportItem[]> {
    return groupReports(await reportRepository.list(status));
  },

  /** An admin settles every open report about one ad. */
  async resolve(admin: { id: string; email: string }, { kind, targetId, decision }: ResolveInput, now = new Date()): Promise<Result> {
    const open = (await reportRepository.list("OPEN")).filter((r) => (kind === "promotion" ? r.promotionId : r.bannerId) === targetId);
    if (open.length === 0) return { ok: false, error: "There's nothing open to review for this ad." };

    const first = open[0];
    const target = kind === "promotion" ? first.promotion : first.banner;
    const title = target?.title ?? "the ad";
    const ownerId = target?.business?.ownerId ?? null;
    const reason = REASON_LABEL[commonReason(open) as ReportReasonId];
    const where = kind === "promotion" ? "/business/promotions" : "/business/banners";
    const noun = kind === "promotion" ? "promotion" : "banner";

    const notice =
      ownerId && decision === "WARNED"
        ? { ownerId, title: `Your ${noun} was reported`, description: `“${title}” was reported by customers (${reason.toLowerCase()}). Please check it is accurate and fair.`, href: where }
        : ownerId && decision === "REMOVED"
          ? { ownerId, title: `Your ${noun} was removed`, description: `“${title}” was taken down after reports (${reason.toLowerCase()}). Contact us if you think this is a mistake.`, href: where }
          : null;

    const settled = await reportRepository.resolveTarget({
      kind,
      targetId,
      decision,
      adminId: admin.id,
      now,
      notice,
      audit: { actorId: admin.id, actorEmail: admin.email, action: decision === "DISMISSED" ? "report.dismiss" : decision === "WARNED" ? "report.warn" : "report.remove", targetId, targetLabel: `${noun}: ${title}` },
    });
    if (settled === 0) return { ok: false, error: "Someone else already reviewed this." };
    return { ok: true, message: decision === "REMOVED" ? `${title} was removed.` : decision === "WARNED" ? "The business was warned." : "Report dismissed." };
  },
};
