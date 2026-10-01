import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import {
  buildDetail,
  slugFromHref,
} from "@/components/public/utils/detail.utils";

import { BUSINESSES } from "../constant/businesses.data";

export const generateStaticParams = () =>
  BUSINESSES.map((item) => ({ slug: slugFromHref(item.href) }));

export async function generateMetadata({
  params,
}: PageProps<"/businesses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = buildDetail("business", slug, BUSINESSES);
  return {
    title: detail ? `${detail.title} — kuzu` : "Place not found — kuzu",
  };
}

export default async function BusinessPage({
  params,
}: PageProps<"/businesses/[slug]">) {
  const { slug } = await params;
  const detail = buildDetail("business", slug, BUSINESSES);
  if (!detail) notFound();
  return <DetailPage detail={detail} />;
}
