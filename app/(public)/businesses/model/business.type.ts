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
  /** Makes the line a link (a phone, email or web address). */
  href?: string;
}

export interface BusinessProfile {
  slug: string;
  name: string;
  category: string;
  area: string;
  badge?: string;
  openedLabel: string;
  openingOffer: string;
  tagline?: string;
  about: string[];
  hours: BusinessHours[];
  activity: ActivityItem[];
  similar: PromotionCardData[];
  /** Set for a real business. Sample places leave these out and use the placeholder text. */
  contacts?: BusinessContact[];
  services?: string[];
  products?: string[];
  /** Photos aren't stored yet, so real businesses don't show the placeholder gallery. */
  showGallery?: boolean;
  /** True when the signed-in person owns this business. */
  isOwner?: boolean;
  /** Stored images (real businesses only). */
  logoUrl?: string;
  coverUrl?: string;
  photos?: string[];
}
