import { DAILY_POINTS } from "../../dashboard/constant/dashboard.data";
import type { DailyPoint } from "../../dashboard/model/dashboard.type";
import { minorToInput, parseMoney } from "@/lib/formatters/currency";
import type { CampaignInput } from "@/lib/validations/campaign.schema";

import { PROMOTION_ITEMS } from "../../../promotions/constant/promotions.data";
import type {
  CampaignEstimate,
  CampaignFilters,
  CampaignItem,
} from "../model/campaign.type";

export function filterCampaigns(
  items: CampaignItem[],
  filters: CampaignFilters,
): CampaignItem[] {
  const query = filters.query.trim().toLowerCase();
  return items.filter(
    (c) =>
      (filters.status === "ALL" || c.status === filters.status) &&
      (!query || c.name.toLowerCase().includes(query)),
  );
}

export const countByStatus = (
  items: CampaignItem[],
  status: CampaignFilters["status"],
) =>
  status === "ALL"
    ? items.length
    : items.filter((c) => c.status === status).length;

export const isLive = (status: CampaignItem["status"]) =>
  status === "ACTIVE" || status === "PAUSED";

export function toFormValues(item: CampaignItem): CampaignInput {
  return {
    name: item.name,
    promotionId: item.promotionId,
    cpc: minorToInput(item.cpcMinor),
    dailyBudget:
      item.dailyBudgetMinor === null ? "" : minorToInput(item.dailyBudgetMinor),
    totalBudget: minorToInput(item.budgetMinor),
    startDate: item.startDate,
    endDate: item.endDate,
    destination: item.destination,
    destinationUrl: item.destinationUrl,
    locations: item.locations,
    interests: item.interests,
    schedule: item.schedule,
    intent: item.status === "DRAFT" ? "DRAFT" : "LAUNCH",
  };
}

/** How many paid clicks a budget buys: floor(budget / cpc), using integer minor units. */
export function estimate({
  cpc,
  dailyBudget,
  totalBudget,
}: Pick<
  CampaignInput,
  "cpc" | "dailyBudget" | "totalBudget"
>): CampaignEstimate {
  const cpcMinor = parseMoney(cpc);
  const total = parseMoney(totalBudget);
  const daily = dailyBudget ? parseMoney(dailyBudget) : null;
  if (!cpcMinor || total === null)
    return { maxClicks: null, dailyClicks: null, days: null };

  return {
    maxClicks: Math.floor(total / cpcMinor),
    dailyClicks: daily ? Math.floor(daily / cpcMinor) : null,
    days: daily ? Math.ceil(total / daily) : null,
  };
}

/** Only published promotions can be boosted. */
export const publishedPromotionOptions = () =>
  PROMOTION_ITEMS.filter((p) => p.status === "PUBLISHED").map((p) => ({
    value: p.id,
    label: p.values.title,
  }));

/** Sample series: spreads the campaign's totals across the dashboard's 14 sample days. */
export function sampleDailyPoints(item: CampaignItem): DailyPoint[] {
  if (item.clicks === 0) return [];
  const totalClicks = DAILY_POINTS.reduce((sum, p) => sum + p.clicks, 0);
  const factor = item.clicks / totalClicks;
  return DAILY_POINTS.map((p) => {
    const clicks = Math.max(0, Math.round(p.clicks * factor));
    return {
      label: p.label,
      clicks,
      impressions: Math.round(p.impressions * factor),
      spendMinor: clicks * item.cpcMinor,
    };
  });
}
