import type { EMAIL_CAMPAIGN_STATUSES } from "@/lib/constants";

export type EmailCampaignStatus = (typeof EMAIL_CAMPAIGN_STATUSES)[number];

export interface EmailCampaignItem {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  body: string;
  promotionId: string;
  locations: string[];
  interests: string[];
  birthdayThisMonth: boolean;
  status: EmailCampaignStatus;
  /** Local date-time "YYYY-MM-DDTHH:mm", or "" when not scheduled. */
  sendAt: string;
  recipients: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
}

export interface EmailCampaignFilters {
  query: string;
  status: EmailCampaignStatus | "ALL";
}

export interface AudienceFilters {
  locations: string[];
  interests: string[];
  birthdayThisMonth: boolean;
}

export interface OptionItem {
  value: string;
  label: string;
}
