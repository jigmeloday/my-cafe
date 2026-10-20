import type { Metadata } from "next";

import type { DetailData } from "@/components/public/model/detail.type";

import { pageMetadata } from "./metadata";

/** Page title, description and share card for a deal or event. */
export function detailMetadata(detail: DetailData): Metadata {
  const isEvent = detail.kind === "event";
  const where = detail.shop.area ? ` in ${detail.shop.area}` : "";
  return pageMetadata({
    title: detail.title,
    description: detail.seo?.description || `${detail.title} at ${detail.shop.name}${where}.`,
    path: `/${isEvent ? "events" : "promotions"}/${detail.slug}`,
    image: detail.photos?.[0] ?? detail.shopLogo,
    type: "article",
  });
}
