import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import { buildDetail } from "@/components/public/utils/detail.utils";
import { discoveryService } from "@/services/discovery/discovery.service";

import { EVENTS } from "../constant/events.data";

// Real events are added at any time, so every page is read when asked for.
export const dynamic = "force-dynamic";

/** A real event from the database, otherwise one of the sample events. */
const load = async (slug: string) => (await discoveryService.promotionDetail(slug)) ?? buildDetail("event", slug, EVENTS);

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await load(slug);
  return {
    title: detail ? `${detail.title} — kuzu` : "Event not found — kuzu",
  };
}

export default async function EventDetailPage({
  params,
}: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const detail = await load(slug);
  if (!detail) notFound();
  // A real promotion that isn't an event belongs under /promotions.
  if (detail.kind === "promotion" && detail.promotionId) redirect(`/promotions/${slug}`);
  return <DetailPage detail={detail} />;
}
