import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import { requireRole } from "@/lib/session";
import { discoveryService } from "@/services/discovery/discovery.service";

export const metadata: Metadata = { title: "Preview a promotion — Nook business" };

/** How one of your promotions looks to customers, inside the dashboard (drafts too). */
export default async function PreviewPromotionPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireRole("BUSINESS_OWNER");
  const { slug } = await params;
  const detail = await discoveryService.previewDetail(user.id, slug);
  if (!detail) notFound();
  return <DetailPage detail={detail} />;
}
