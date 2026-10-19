import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { DEFAULT_FILTERS } from "../constant/promotion.constant";
import type { PromotionFilters, PromotionItem } from "../model/promotion.type";

export function filterPromotions(
  items: PromotionItem[],
  filters: PromotionFilters,
): PromotionItem[] {
  const query = filters.query.trim().toLowerCase();
  return items.filter(
    ({ status, values }) =>
      (filters.status === "ALL" || status === filters.status) &&
      (filters.type === "ALL" || values.type === filters.type) &&
      (!query || values.title.toLowerCase().includes(query)),
  );
}

export const countByStatus = (
  items: PromotionItem[],
  status: PromotionFilters["status"],
) =>
  status === "ALL"
    ? items.length
    : items.filter((i) => i.status === status).length;

export const hasActiveFilters = (f: PromotionFilters) =>
  f.query !== DEFAULT_FILTERS.query ||
  f.status !== DEFAULT_FILTERS.status ||
  f.type !== DEFAULT_FILTERS.type;

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

/** "5 Oct – 20 Oct", "Until 20 Oct", "From 5 Oct" or "No dates". */
export function formatDateRange({
  startDate,
  endDate,
}: Pick<PromotionInput, "startDate" | "endDate">) {
  if (startDate && endDate)
    return `${formatDay(startDate)} – ${formatDay(endDate)}`;
  if (endDate) return `Until ${formatDay(endDate)}`;
  if (startDate) return `From ${formatDay(startDate)}`;
  return "No dates";
}
