import type { PromotionInput } from "@/lib/validations/promotion.schema";

import type { PromotionItem } from "../model/promotion.type";

const make = (
  id: string,
  status: PromotionItem["status"],
  clicks: number,
  boosted: boolean,
  values: Partial<PromotionInput> &
    Pick<PromotionInput, "title" | "type" | "discount">,
): PromotionItem => ({
  id,
  status,
  clicks,
  boosted,
  values: {
    description:
      "[Describe the offer — what is included, who it is for and any terms.]",
    startDate: "2026-10-05",
    endDate: "2026-10-20",
    location: "Norzin Lam, Thimphu",
    category: "Fashion",
    ctaType: "VIEW_OFFER",
    ctaUrl: "",
    emailFollowers: false,
    bannerDays: "0",
    topRankDays: "0",
    ...values,
    status: "PUBLISHED",
  },
});

// Sample data: replaced by the business's real promotions once the database exists.
export const PROMOTION_ITEMS: PromotionItem[] = [
  make("p1", "PUBLISHED", 67, true, {
    title: "20% off hand-woven kira",
    type: "SALE",
    discount: "20% off",
  }),
  make("p2", "PUBLISHED", 54, true, {
    title: "Opening-week set menu",
    type: "DEAL",
    discount: "Set menu Nu. [PRICE]",
    category: "Food",
  }),
  make("p3", "PUBLISHED", 21, false, {
    title: "Festival night market stall",
    type: "EVENT",
    discount: "Free entry",
    category: "Events",
    endDate: "2026-10-10",
  }),
  make("p4", "DRAFT", 0, false, {
    title: "Free delivery in Thimphu",
    type: "ANNOUNCEMENT",
    discount: "",
    description: "",
    startDate: "",
    endDate: "",
    category: "",
  }),
  make("p5", "PUBLISHED", 12, false, {
    title: "Winter coats clearance",
    type: "SALE",
    discount: "40% off",
    startDate: "2026-10-12",
    endDate: "2026-10-31",
  }),
  make("p6", "ENDED", 100, false, {
    title: "Summer sale",
    type: "SALE",
    discount: "30% off",
    startDate: "2026-07-01",
    endDate: "2026-08-15",
  }),
  make("p7", "ENDED", 38, false, {
    title: "Losar giveaway",
    type: "GIVEAWAY",
    discount: "Win a hamper",
    category: "Home",
    startDate: "2026-02-10",
    endDate: "2026-02-20",
  }),
  make("p8", "DRAFT", 0, false, {
    title: "Alterations service",
    type: "SERVICE",
    discount: "From Nu. [PRICE]",
    description: "Quick alterations while you wait.",
    startDate: "",
    endDate: "",
  }),
];

export const findPromotion = (id: string) =>
  PROMOTION_ITEMS.find((p) => p.id === id);
