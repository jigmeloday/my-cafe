import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import { DetailJsonLd } from "@/components/seo/detail-json-ld";
import { detailMetadata } from "@/lib/seo/detail";
import { NO_INDEX } from "@/lib/seo/metadata";
import { discoveryService } from "@/services/discovery/discovery.service";

// New promotions appear as soon as they are published, so every page is read when asked for.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/promotions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await discoveryService.promotionDetail(slug);
  return detail ? detailMetadata(detail) : { title: "Deal not found — Nook", ...NO_INDEX };
}

export default async function PromotionPage({ params }: PageProps<"/promotions/[slug]">) {
  const { slug } = await params;
  const detail = await discoveryService.promotionDetail(slug);
  if (!detail) notFound();
  // A real event lives under /events.
  if (detail.kind === "event") redirect(`/events/${slug}`);
  return (
    <>
      <DetailJsonLd detail={detail} />
      <DetailPage detail={detail} />
    </>
  );
}
