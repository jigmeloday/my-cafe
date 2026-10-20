import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site";
import { discoveryService } from "@/services/discovery/discovery.service";

// New promotions and businesses should show up without a new build.
export const dynamic = "force-dynamic";

const PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/deals", priority: 0.9, changeFrequency: "daily" },
  { path: "/events", priority: 0.9, changeFrequency: "daily" },
  { path: "/discover", priority: 0.8, changeFrequency: "daily" },
  { path: "/categories", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/careers", priority: 0.3, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { promotions, businesses, categories } = await discoveryService.sitemap();
  return [
    ...PAGES.map((p) => ({ url: absoluteUrl(p.path), priority: p.priority, changeFrequency: p.changeFrequency })),
    ...categories.map((c) => ({ url: absoluteUrl(`/categories/${c.slug}`), changeFrequency: "daily" as const, priority: 0.6 })),
    ...promotions.map((p) => ({ url: absoluteUrl(`/${p.type === "EVENT" ? "events" : "promotions"}/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "daily" as const, priority: 0.8 })),
    ...businesses.map((b) => ({ url: absoluteUrl(`/businesses/${b.slug}`), lastModified: b.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
