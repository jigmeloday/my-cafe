import { NextResponse } from "next/server";
import { z } from "zod";

import { SOURCES } from "@/app/(business)/business/analytics/constant/analytics.constant";
import { getCurrentUser } from "@/lib/session";
import { bannerRepository } from "@/server/repositories/banner.repository";
import { bhutanToday } from "@/services/discovery/discovery.service";
import { analyticsRepository } from "@/server/repositories/analytics.repository";

const bodySchema = z.object({
  /** Set for a promotion... */
  promotionId: z.string().min(1).max(100).optional(),
  /** ...or for a homepage banner. Exactly one of the two. */
  bannerId: z.string().min(1).max(100).optional(),
  type: z.enum(["VIEW", "CLICK"]),
  source: z.string().max(30).default("other"),
}).refine((b) => !!b.promotionId !== !!b.bannerId, "Send either promotionId or bannerId");

const SOURCE_IDS = SOURCES.map((s) => s.id);

/**
 * Counts a view or a click on a promotion. Anyone may call it (visitors aren't signed in), so it only ever
 * adds one small row, only for a live promotion, and never for the business's own owner.
 */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const { promotionId, bannerId, type, source } = parsed.data;
  if (bannerId) {
    // Only a banner that is running today is counted.
    return NextResponse.json({ ok: true, counted: await bannerRepository.recordEvent(bannerId, type, bhutanToday()) });
  }
  const viewer = await getCurrentUser();
  if (!promotionId || !(await analyticsRepository.isCountable(promotionId, viewer?.id ?? null))) {
    return NextResponse.json({ ok: true, counted: false });
  }
  await analyticsRepository.recordEvent(promotionId, type, SOURCE_IDS.includes(source) ? source : "other");
  return NextResponse.json({ ok: true, counted: true });
}
