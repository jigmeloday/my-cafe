import type { DetailData } from "@/components/public/model/detail.type";
import { breadcrumbSchema, eventSchema, offerSchema } from "@/lib/seo/schema";

import { JsonLd } from "./json-ld";

/** Tells search engines what a deal or event page is about: the offer or event, its business, and where it sits on the site. */
export function DetailJsonLd({ detail }: { detail: DetailData }) {
  const seo = detail.seo;
  if (!seo) return null;
  const isEvent = detail.kind === "event";
  const path = `/${isEvent ? "events" : "promotions"}/${detail.slug}`;
  const input = {
    name: detail.title,
    path,
    description: seo.description,
    image: detail.photos?.[0] ?? detail.shopLogo,
    startsAt: seo.startsAt,
    endsAt: seo.endsAt,
    seller: { name: detail.shop.name, path: detail.shop.href },
    place: seo.place,
    address: { street: seo.street, town: seo.town, dzongkhag: seo.dzongkhag },
  };
  const crumbs = [
    { name: "Home", path: "/" },
    { name: isEvent ? "Events" : "Deals", path: isEvent ? "/events" : "/deals" },
    { name: detail.title, path },
  ];
  return <JsonLd data={[isEvent ? eventSchema(input) : offerSchema(input), breadcrumbSchema(crumbs)]} />;
}
