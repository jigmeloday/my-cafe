import type { CAMPAIGN_STATUSES } from "@/lib/constants";

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export type MetricId = "clicks" | "impressions" | "spend";

export interface DailyPoint {
  label: string;
  impressions: number;
  clicks: number;
  /** Integer minor units. */
  spendMinor: number;
}

export interface MetricOption {
  id: MetricId;
  label: string;
}

export interface CampaignRow {
  id: string;
  name: string;
  promotion: string;
  status: CampaignStatus;
  budgetMinor: number;
  spentMinor: number;
  cpcMinor: number;
  impressions: number;
  clicks: number;
}

export interface PromotionRow {
  id: string;
  title: string;
  type: string;
  status: "Published" | "Draft" | "Ended";
  clicks: number;
  boosted: boolean;
}

export interface SummaryStat {
  label: string;
  value: string;
  delta?: number;
  lowerIsBetter?: boolean;
  hint?: string;
}
