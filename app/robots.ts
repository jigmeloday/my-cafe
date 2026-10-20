import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo/site";

/** Keeps search engines out of accounts, dashboards and the API, but lets them read the public site and its images. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/media/"],
      // "/business/" is the owner dashboard. "/businesses/" (public pages) stays open.
      disallow: ["/admin", "/business/", "/business$", "/profile", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/verified", "/search", "/report", "/api/", "/playground"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
