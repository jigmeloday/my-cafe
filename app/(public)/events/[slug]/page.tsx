import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import { DetailJsonLd } from "@/components/seo/detail-json-ld";
import { detailMetadata } from "@/lib/seo/detail";
import { NO_INDEX } from "@/lib/seo/metadata";
import { discoveryService } from "@/services/discovery/discovery.service";

// New events are added at any time, so every page is read when asked for.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await discoveryService.promotionDetail(slug);
  return detail ? detailMetadata(detail) : { title: "Event not found — Nook", ...NO_INDEX };
}

export default async function EventDetailPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const detail = await discoveryService.promotionDetail(slug);
  if (!detail) notFound();
  // A promotion that isn't an event belongs under /promotions.
  if (detail.kind === "promotion") redirect(`/promotions/${slug}`);
  return (
    <>
      <DetailJsonLd detail={detail} />
      <DetailPage detail={detail} />
    </>
  );
}
