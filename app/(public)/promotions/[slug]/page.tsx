import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import {
  buildDetail,
  slugFromHref,
} from "@/components/public/utils/detail.utils";

import { PROMOTIONS } from "../constant/promotions.data";

export const generateStaticParams = () =>
  PROMOTIONS.map((item) => ({ slug: slugFromHref(item.href) }));

export async function generateMetadata({
  params,
}: PageProps<"/promotions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = buildDetail("promotion", slug, PROMOTIONS);
  return { title: detail ? `${detail.title} — kuzu` : "Deal not found — kuzu" };
}

export default async function PromotionPage({
  params,
}: PageProps<"/promotions/[slug]">) {
  const { slug } = await params;
  const detail = buildDetail("promotion", slug, PROMOTIONS);
  if (!detail) notFound();
  return <DetailPage detail={detail} />;
}
