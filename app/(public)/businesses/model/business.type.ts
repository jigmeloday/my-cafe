import type { LucideIcon } from "lucide-react";

import type { PromotionCardData } from "@/components/public/model/promotion.type";

export interface BusinessHours {
  day: string;
  hours: string;
}

export type ActivityStatus = "current" | "upcoming" | "past";

export interface ActivityItem extends PromotionCardData {
  status: ActivityStatus;
}

export interface ActivityTab {
  id: ActivityStatus;
  label: string;
  emptyTitle: string;
  emptyDescription: string;
}

export interface BusinessContact {
  key: string;
  icon: LucideIcon;
  text: string;
}

export interface BusinessProfile {
  slug: string;
  name: string;
  category: string;
  area: string;
  badge?: string;
  openedLabel: string;
  openingOffer: string;
  about: string[];
  hours: BusinessHours[];
  activity: ActivityItem[];
  similar: PromotionCardData[];
}
