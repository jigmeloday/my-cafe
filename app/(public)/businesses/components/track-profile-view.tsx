"use client";

import { useEffect } from "react";

import { trackBusiness } from "@/lib/track-client";

/** Counts one visit to a business's page when it opens. Renders nothing. */
export function TrackProfileView({ slug }: { slug: string }) {
  useEffect(() => {
    trackBusiness(slug, "VIEW");
  }, [slug]);
  return null;
}
