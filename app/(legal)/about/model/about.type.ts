import type { LucideIcon } from "lucide-react";

import type { discoveryService } from "@/services/discovery/discovery.service";

export interface AboutStep {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface AboutPillar extends AboutStep {
  href: string;
  cta: string;
}

/** The real totals the site holds right now. */
export type SiteStats = Awaited<ReturnType<typeof discoveryService.siteStats>>;

/** One box in the opening section: a live number when there is one, otherwise a short description. */
export interface AboutTile {
  icon: LucideIcon;
  label: string;
  value?: number;
  text: string;
}
