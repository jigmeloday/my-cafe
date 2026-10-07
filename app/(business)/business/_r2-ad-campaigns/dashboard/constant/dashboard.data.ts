import { CAMPAIGN_ITEMS } from "../../campaigns/constant/campaigns.data";
import { TYPE_OPTIONS } from "../../../promotions/constant/promotion.constant";
import {
  findPromotion,
  PROMOTION_ITEMS,
} from "../../../promotions/constant/promotions.data";
import type {
  CampaignRow,
  DailyPoint,
  PromotionRow,
} from "../model/dashboard.type";

// Sample data. Money is in integer minor units (cents).
export const DAILY_POINTS: DailyPoint[] = [
  { label: "19 Sep", impressions: 648, clicks: 18, spendMinor: 900 },
  { label: "20 Sep", impressions: 806, clicks: 22, spendMinor: 1100 },
  { label: "21 Sep", impressions: 712, clicks: 19, spendMinor: 950 },
  { label: "22 Sep", impressions: 972, clicks: 27, spendMinor: 1350 },
  { label: "23 Sep", impressions: 1130, clicks: 31, spendMinor: 1550 },
  { label: "24 Sep", impressions: 892, clicks: 24, spendMinor: 1200 },
  { label: "25 Sep", impressions: 720, clicks: 20, spendMinor: 1000 },
  { label: "26 Sep", impressions: 950, clicks: 26, spendMinor: 1300 },
  { label: "27 Sep", impressions: 1216, clicks: 33, spendMinor: 1650 },
  { label: "28 Sep", impressions: 1044, clicks: 29, spendMinor: 1450 },
  { label: "29 Sep", impressions: 1274, clicks: 35, spendMinor: 1750 },
  { label: "30 Sep", impressions: 1036, clicks: 28, spendMinor: 1400 },
  { label: "1 Oct", impressions: 1080, clicks: 30, spendMinor: 1500 },
  { label: "2 Oct", impressions: 1346, clicks: 37, spendMinor: 1850 },
];

export const WALLET = {
  balanceMinor: 12850,
  spentThisMonthMinor: 17100,
};

export const CAMPAIGNS: CampaignRow[] = CAMPAIGN_ITEMS.filter(
  (c) => c.status !== "DRAFT",
).map((c) => ({
  id: c.id,
  name: c.name,
  promotion: findPromotion(c.promotionId)?.values.title ?? "",
  status: c.status,
  budgetMinor: c.budgetMinor,
  spentMinor: c.spentMinor,
  cpcMinor: c.cpcMinor,
  impressions: c.impressions,
  clicks: c.clicks,
}));

export const PROMOTIONS: PromotionRow[] = PROMOTION_ITEMS.slice(0, 4).map(
  ({ id, status, clicks, boosted, values }) => ({
    id,
    title: values.title,
    type:
      TYPE_OPTIONS.find((t) => t.value === values.type)?.label ?? values.type,
    status,
    clicks,
    boosted,
  }),
);
