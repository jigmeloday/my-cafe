"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { sectionFromPath } from "@/lib/track-events";
import { trackSite } from "@/lib/track-client";

/** Counts each page opened on the public site, once per page. Renders nothing. */
export function TrackSite() {
  const pathname = usePathname();
  useEffect(() => {
    trackSite(sectionFromPath(pathname));
  }, [pathname]);
  return null;
}
