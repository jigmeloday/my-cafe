import type { PROMOTION_STATUSES, PROMOTION_TYPES } from "@/lib/constants";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

export type PromotionType = (typeof PROMOTION_TYPES)[number];
export type PromotionStatus = (typeof PROMOTION_STATUSES)[number];

export interface PromotionItem {
  id: string;
  status: PromotionStatus;
  clicks: number;
  boosted: boolean;
  values: PromotionInput;
}

export interface OptionItem<T extends string = string> {
  value: T;
  label: string;
}

export interface PromotionFilters {
  query: string;
  status: PromotionStatus | "ALL";
  type: PromotionType | "ALL";
}
