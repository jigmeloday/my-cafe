import {
  bannerCost,
  COIN_COSTS,
  emailCost,
  PLACEMENT_DAYS,
  topRankCost,
} from "@/lib/coins";
import { formatCoins } from "@/lib/formatters/number";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { estimateRecipients } from "../../campaigns/utils/email-campaign.utils";

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

/** Select options such as "3 days · 600 coins" for a placement that costs `perDay` coins a day. */
export const dayOptions = (perDay: number) =>
  PLACEMENT_DAYS.map((value) => ({
    value,
    label:
      value === "0"
        ? "Not now"
        : `${value} days · ${formatCoins(Number(value) * perDay)}`,
  }));

export const BANNER_OPTIONS = dayOptions(COIN_COSTS.bannerPerDay);
export const TOP_RANK_OPTIONS = dayOptions(COIN_COSTS.topRankPerDay);

/** All followers who could receive an email (no audience filters). */
export const allFollowerRecipients = () =>
  estimateRecipients({
    locations: [],
    interests: [],
    birthdayThisMonth: false,
  });

type CostInput = Pick<
  PromotionInput,
  "emailFollowers" | "bannerDays" | "topRankDays"
>;

export const promotionCoinCost = ({
  emailFollowers,
  bannerDays,
  topRankDays,
}: CostInput) =>
  (emailFollowers ? emailCost(allFollowerRecipients()) : 0) +
  bannerCost(Number(bannerDays)) +
  topRankCost(Number(topRankDays));
