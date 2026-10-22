import { NextResponse } from "next/server";
import { z } from "zod";

import { SOURCES } from "@/app/(business)/business/analytics/constant/analytics.constant";
import { BUSINESS_EVENT_TYPES, SITE_SECTIONS } from "@/lib/track-events";
import { getCurrentUser } from "@/lib/session";
import { bannerRepository } from "@/server/repositories/banner.repository";
import { bhutanToday } from "@/services/discovery/discovery.service";
import { trackingService } from "@/services/analytics/tracking.service";

const source = z.string().max(30).default("other");
const id = z.string().min(1).max(100);
const viewOrClick = z.enum(["VIEW", "CLICK"]);
const promotionEvent = z.enum(["VIEW", "CLICK", "SHARE", "WHATSAPP"]);

/** One of four things a page can report. They are told apart by which field they carry. */
const bodySchema = z.union([
  z.object({ promotionId: id, type: promotionEvent, source }),
  z.object({ bannerId: id, type: viewOrClick }),
  z.object({ businessSlug: id, type: z.enum(BUSINESS_EVENT_TYPES), source }),
  z.object({ section: z.enum(SITE_SECTIONS) }),
]);

const SOURCE_IDS = SOURCES.map((s) => s.id);
const knownSource = (value: string) => (SOURCE_IDS.includes(value) ? value : "other");

/**
 * Counts a view or a click: on a promotion, a banner, a business's page and links, or a page of the site.
 * Anyone may call it (visitors aren't signed in), so each call adds at most one small row, only for something
 * real and live, never for a robot, and never the same thing twice in a row (see tracking.service.ts).
 */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const body = parsed.data;

  if ("bannerId" in body) {
    // Only a banner that is running today is counted.
    return NextResponse.json({ ok: true, counted: await bannerRepository.recordEvent(body.bannerId, body.type, bhutanToday()) });
  }
  if ("section" in body) return NextResponse.json({ ok: true, counted: await trackingService.site(body.section) });

  const viewer = await getCurrentUser();
  const counted =
    "promotionId" in body
      ? await trackingService.promotion({ promotionId: body.promotionId, type: body.type, source: knownSource(body.source) }, viewer?.id ?? null)
      : await trackingService.business({ slug: body.businessSlug, type: body.type, source: knownSource(body.source) }, viewer?.id ?? null);
  return NextResponse.json({ ok: true, counted });
}
