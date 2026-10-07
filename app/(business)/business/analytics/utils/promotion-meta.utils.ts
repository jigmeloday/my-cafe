import { PROMOTION_ITEMS } from "../../promotions/constant/promotions.data";
import type { PromotionMeta } from "../model/analytics.type";

const titleCase = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

/** Promotions that can have activity (drafts have none), in the shape analytics needs. */
export const PROMOTION_METAS: PromotionMeta[] = PROMOTION_ITEMS.filter(
  (p) => p.status !== "DRAFT",
).map((p) => ({
  id: p.id,
  title: p.values.title,
  type: titleCase(p.values.type),
  ended: p.status === "ENDED",
}));

export const promotionTitle = (id: string) =>
  PROMOTION_METAS.find((p) => p.id === id)?.title ?? "Promotion";
