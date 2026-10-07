import { CATEGORIES } from "@/components/public/constant/site.constant";
import { CAMPAIGN_STATUS } from "@/components/business/constant/status.constant";
import { CAMPAIGN_STATUSES, DZONGKHAGS } from "@/lib/constants";
import type { CampaignInput } from "@/lib/validations/campaign.schema";

import type { CampaignFilters, OptionItem } from "../model/campaign.type";

export const DESTINATION_OPTIONS: OptionItem[] = [
  { value: "PROMOTION", label: "The promotion page" },
  { value: "PROFILE", label: "My business profile" },
  { value: "CUSTOM", label: "A custom link" },
];

export const SCHEDULE_OPTIONS: OptionItem[] = [
  { value: "ALWAYS", label: "Every day" },
  { value: "WEEKENDS", label: "Weekends only" },
];

export const LOCATION_OPTIONS = [...DZONGKHAGS];
export const INTEREST_OPTIONS = CATEGORIES.map(({ label }) => label);

export const STATUS_FILTERS = [
  { id: "ALL", label: "All" },
  ...CAMPAIGN_STATUSES.map((id) => ({ id, label: CAMPAIGN_STATUS[id].label })),
];

export const DEFAULT_FILTERS: CampaignFilters = { query: "", status: "ALL" };

export const NEW_CAMPAIGN: CampaignInput = {
  name: "",
  promotionId: "",
  cpc: "0.50",
  dailyBudget: "",
  totalBudget: "50.00",
  startDate: "",
  endDate: "",
  destination: "PROMOTION",
  destinationUrl: "",
  locations: [],
  interests: [],
  schedule: "ALWAYS",
  intent: "DRAFT",
};

export const CAMPAIGNS_COPY = {
  title: "Campaigns",
  subtitle:
    "Pay per click to put a promotion in front of more people. You only pay for valid clicks.",
  create: "Create campaign",
  searchPlaceholder: "Search campaigns",
  emptyTitle: "No campaigns match",
  emptyDescription:
    "Try a different search or filter, or create a new campaign.",
  newTitle: "New campaign",
  newSubtitle: "Choose a promotion, set your price per click and a budget.",
  editTitle: "Edit campaign",
  editSubtitle: "Changes apply to new clicks only.",
  back: "Campaigns",
  saveDraft: "Save as draft",
  launch: "Launch campaign",
  estimateTitle: "Estimate",
  estimateHint: "Based on your price per click and budget.",
  walletLabel: "Wallet balance",
  walletWarning:
    "Your budget is more than your wallet balance. The campaign will pause if the wallet runs out.",
  pause: "Pause",
  resume: "Resume",
  edit: "Edit",
  cancel: "Cancel campaign",
  noPromotion: "No promotion chosen yet",
};

export const NO_PUBLISHED_PROMOTIONS =
  "You need a published promotion before you can launch a campaign.";

export const DETAIL_COPY = {
  budgetTitle: "Budget",
  budgetNote:
    "The campaign stops by itself when the budget is spent, the wallet runs out or the end date passes.",
  settingsTitle: "Settings",
  clicksTitle: "Recent clicks",
  noClicks:
    "No clicks yet. They'll show up here as people open your promotion.",
  filteredNote: "Filtered clicks aren't charged.",
  valid: "Valid",
  filtered: "Filtered",
  everywhere: "Everywhere",
  everyone: "Everyone",
  noEndDate: "Until the budget is spent",
  noDailyLimit: "No daily limit",
};
