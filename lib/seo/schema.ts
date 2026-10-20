import { SEO, absoluteUrl, clip, siteUrl } from "./site";

type Json = Record<string, unknown>;

/** Drops empty values so the output holds only what is known. */
const clean = (value: Json): Json => Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)));

export const organizationSchema = (): Json => ({ "@context": "https://schema.org", "@type": "Organization", name: SEO.name, url: siteUrl(), logo: absoluteUrl("/icon.svg"), areaServed: { "@type": "Country", name: "Bhutan" } });

/** Lets search engines offer a search box for Nook in results. */
export const websiteSchema = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SEO.name,
  url: siteUrl(),
  inLanguage: "en",
  potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${siteUrl()}/search?q={search_term_string}` }, "query-input": "required name=search_term_string" },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]): Json => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
});

interface Address { street?: string; town?: string; dzongkhag?: string; postalCode?: string }

const addressSchema = (a: Address): Json | undefined =>
  a.street || a.town || a.dzongkhag
    ? clean({ "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.town || a.dzongkhag, addressRegion: a.dzongkhag, postalCode: a.postalCode, addressCountry: SEO.country })
    : undefined;

export interface PlaceSeo extends Address {
  name: string;
  path: string;
  image?: string;
  phone?: string;
  website?: string;
  description?: string;
  sameAs?: string[];
}

/** A shop, cafe or other business with a public page. */
export const businessSchema = (b: PlaceSeo): Json =>
  clean({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: b.name,
    url: absoluteUrl(b.path),
    description: b.description ? clip(b.description, 300) : undefined,
    image: b.image ? absoluteUrl(b.image) : undefined,
    telephone: b.phone,
    address: addressSchema(b),
    sameAs: [b.website, ...(b.sameAs ?? [])].filter(Boolean),
  });

export interface OfferSeo {
  name: string;
  path: string;
  description: string;
  image?: string;
  /** Dates like "2026-11-01". */
  startsAt?: string;
  endsAt?: string;
  seller: { name: string; path: string };
  place?: string;
  address?: Address;
}

export const eventSchema = (e: OfferSeo): Json =>
  clean({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    url: absoluteUrl(e.path),
    description: clip(e.description, 300),
    image: e.image ? [absoluteUrl(e.image)] : undefined,
    startDate: e.startsAt,
    endDate: e.endsAt ?? e.startsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: clean({ "@type": "Place", name: e.place, address: addressSchema(e.address ?? {}) ?? { "@type": "PostalAddress", addressCountry: SEO.country } }),
    organizer: { "@type": "Organization", name: e.seller.name, url: absoluteUrl(e.seller.path) },
  });

export const offerSchema = (o: OfferSeo): Json =>
  clean({
    "@context": "https://schema.org",
    "@type": "Offer",
    name: o.name,
    url: absoluteUrl(o.path),
    description: clip(o.description, 300),
    image: o.image ? [absoluteUrl(o.image)] : undefined,
    validFrom: o.startsAt,
    validThrough: o.endsAt,
    availability: "https://schema.org/InStock",
    seller: { "@type": "LocalBusiness", name: o.seller.name, url: absoluteUrl(o.seller.path) },
  });
