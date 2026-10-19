import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import { buildDetail } from "@/components/public/utils/detail.utils";
import { discoveryService } from "@/services/discovery/discovery.service";

import { PROMOTIONS } from "../constant/promotions.data";

// Real promotions are added at any time, so every page is read when asked for.
export const dynamic = "force-dynamic";

/** A published promotion from the database, otherwise one of the sample deals. */
const load = async (slug: string) => (await discoveryService.promotionDetail(slug)) ?? buildDetail("promotion", slug, PROMOTIONS);

export async function generateMetadata({
  params,
}: PageProps<"/promotions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await load(slug);
  return { title: detail ? `${detail.title} — kuzu` : "Deal not found — kuzu" };
}

export default async function PromotionPage({
  params,
}: PageProps<"/promotions/[slug]">) {
  const { slug } = await params;
  const detail = await load(slug);
  if (!detail) notFound();
  // A real event lives under /events.
  if (detail.kind === "event" && detail.promotionId) redirect(`/events/${slug}`);
  return <DetailPage detail={detail} />;
}
