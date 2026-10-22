import type { LucideIcon } from "lucide-react";

/** Who a feature is for. */
export type RoadmapAudience = "customers" | "businesses";

/** How close it is: "soon" is being worked on now; "planned" is next in line. */
export type RoadmapStatus = "soon" | "planned";

export interface RoadmapItem {
  id: string;
  audience: RoadmapAudience;
  status: RoadmapStatus;
  icon: LucideIcon;
  title: string;
  text: string;
}
