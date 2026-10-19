import type { PromotionCardData } from "@/components/public/model/promotion.type";

export interface HeroSlideData {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  sponsored?: boolean;
  imageLabel: string;
  imageUrl?: string;
  /** Set for a paid banner. Used to count how often it is seen and clicked. */
  bannerId?: string;
}

export interface OfferSectionData {
  id: string;
  title: string;
  href: string;
  items: PromotionCardData[];
}

