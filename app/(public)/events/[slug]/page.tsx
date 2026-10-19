import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import { discoveryService } from "@/services/discovery/discovery.service";

// New events are added at any time, so every page is read when asked for.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await discoveryService.promotionDetail(slug);
  return { title: detail ? `${detail.title} — kuzu` : "Event not found — kuzu" };
}

export default async function EventDetailPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const detail = await discoveryService.promotionDetail(slug);
  if (!detail) notFound();
  // A promotion that isn't an event belongs under /promotions.
  if (detail.kind === "promotion") redirect(`/promotions/${slug}`);
  return <DetailPage detail={detail} />;
}
