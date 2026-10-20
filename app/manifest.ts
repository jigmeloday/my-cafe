import type { MetadataRoute } from "next";

import { SEO } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SEO.name} — ${SEO.tagline}`,
    short_name: SEO.name,
    description: SEO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: SEO.themeColor,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
