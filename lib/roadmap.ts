import { ROADMAP } from "./roadmap.constant";
import type { RoadmapAudience, RoadmapItem } from "@/types/roadmap";

/** The features for one kind of visitor, the nearest ones first. */
export const roadmapFor = (audience: RoadmapAudience): RoadmapItem[] =>
  ROADMAP.filter((item) => item.audience === audience).sort((a, b) => Number(a.status === "planned") - Number(b.status === "planned"));

/** The few nearest features across everyone, for a short "coming next" strip. */
export const roadmapNext = (count: number): RoadmapItem[] =>
  [...ROADMAP].sort((a, b) => Number(a.status === "planned") - Number(b.status === "planned")).slice(0, count);
