import type {
  CAMPAIGN_DESTINATIONS,
  CAMPAIGN_SCHEDULES,
  CAMPAIGN_STATUSES,
} from "@/lib/constants";

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];
export type CampaignDestination = (typeof CAMPAIGN_DESTINATIONS)[number];
export type CampaignSchedule = (typeof CAMPAIGN_SCHEDULES)[number];

/** Money fields are integer minor units (50 = $0.50). */
export interface CampaignItem {
  id: string;
  name: string;
  promotionId: string;
  status: CampaignStatus;
  cpcMinor: number;
  dailyBudgetMinor: number | null;
  budgetMinor: number;
  spentMinor: number;
  startDate: string;
  endDate: string;
  destination: CampaignDestination;
  destinationUrl: string;
  locations: string[];
  interests: string[];
  schedule: CampaignSchedule;
  impressions: number;
  clicks: number;
}

export interface CampaignFilters {
  query: string;
  status: CampaignStatus | "ALL";
}

export interface RecentClick {
  id: string;
  time: string;
  source: string;
  valid: boolean;
  chargedMinor: number;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface CampaignEstimate {
  maxClicks: number | null;
  dailyClicks: number | null;
  days: number | null;
}
