import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetailPage } from "@/components/public/detail/detail-page";
import {
  buildDetail,
  slugFromHref,
} from "@/components/public/utils/detail.utils";

import { EVENTS } from "../constant/events.data";

export const generateStaticParams = () =>
  EVENTS.map((item) => ({ slug: slugFromHref(item.href) }));

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = buildDetail("event", slug, EVENTS);
  return {
    title: detail ? `${detail.title} — kuzu` : "Event not found — kuzu",
  };
}

export default async function EventDetailPage({
  params,
}: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const detail = buildDetail("event", slug, EVENTS);
  if (!detail) notFound();
  return <DetailPage detail={detail} />;
}
