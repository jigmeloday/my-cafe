import type { Metadata } from "next";

import { SEO, clip } from "./site";

interface PageSeo {
  /** The page's own title. " — Nook" is added. */
  title: string;
  description?: string;
  /** The page's own address, like "/deals". Becomes the canonical address. */
  path: string;
  /** A picture for shared links (a stored image path or a full address). */
  image?: string;
  type?: "website" | "article";
  /** Keep the page out of search results. */
  noindex?: boolean;
}

/** Title, description, canonical address and share-card details for one page. */
export function pageMetadata({ title, description = SEO.description, path, image, type = "website", noindex }: PageSeo): Metadata {
  const full = `${title} — ${SEO.name}`;
  const text = clip(description);
  const images = [{ url: image || SEO.defaultImage }];
  return {
    title: { absolute: full },
    description: text,
    alternates: { canonical: path },
    openGraph: { title: full, description: text, url: path, siteName: SEO.name, type, locale: "en_US", images },
    twitter: { card: "summary_large_image", title: full, description: text, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** For areas that are never for search engines (admin, dashboards, login). */
export const NO_INDEX: Metadata = { robots: { index: false, follow: false, nocache: true } };
