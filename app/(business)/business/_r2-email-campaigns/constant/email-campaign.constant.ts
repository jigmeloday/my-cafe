import type { StatusTone } from "@/components/shared/status-badge";
import { CATEGORIES } from "@/components/public/constant/site.constant";
import { DZONGKHAGS, EMAIL_CAMPAIGN_STATUSES } from "@/lib/constants";
import type { EmailCampaignInput } from "@/lib/validations/email-campaign.schema";

import type {
  EmailCampaignFilters,
  EmailCampaignStatus,
  OptionItem,
} from "../model/email-campaign.type";

export const EMAIL_STATUS: Record<
  EmailCampaignStatus,
  { label: string; tone: StatusTone }
> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  SCHEDULED: { label: "Scheduled", tone: "info" },
  SENT: { label: "Sent", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "danger" },
};

export const STATUS_FILTERS = [
  { id: "ALL", label: "All" },
  ...EMAIL_CAMPAIGN_STATUSES.map((id) => ({
    id,
    label: EMAIL_STATUS[id].label,
  })),
];

export const DEFAULT_FILTERS: EmailCampaignFilters = {
  query: "",
  status: "ALL",
};

export const SEND_MODE_OPTIONS: OptionItem[] = [
  { value: "NOW", label: "Send now" },
  { value: "LATER", label: "Schedule for later" },
];

export const LOCATION_OPTIONS = [...DZONGKHAGS];
export const INTEREST_OPTIONS = CATEGORIES.map(({ label }) => label);

export const NEW_EMAIL_CAMPAIGN: EmailCampaignInput = {
  name: "",
  subject: "",
  previewText: "",
  body: "",
  promotionId: "",
  locations: [],
  interests: [],
  birthdayThisMonth: false,
  sendMode: "NOW",
  sendDate: "",
  sendTime: "",
  intent: "DRAFT",
};

// Sample audience maths. Real numbers come from followers who opted in to emails.
export const FOLLOWERS_TOTAL = 248;
export const OPT_IN_RATE = 0.72;
export const BODY_MAX = 2000;

export const EMAIL_COPY = {
  title: "Campaigns",
  subtitle:
    "Email your followers about a new offer or event. Only people who agreed to emails receive them.",
  create: "Create campaign",
  searchPlaceholder: "Search campaigns",
  emptyTitle: "No campaigns match",
  emptyDescription:
    "Try a different search or filter, or create a new campaign.",
  newTitle: "New email campaign",
  newSubtitle: "Write your message, choose who gets it and when it goes out.",
  editTitle: "Edit campaign",
  editSubtitle: "You can change a campaign until it is sent.",
  back: "Campaigns",
  saveDraft: "Save as draft",
  sendNow: "Send campaign",
  schedule: "Schedule campaign",
  sendTest: "Send me a test",
  previewTitle: "Preview",
  previewHint: "How the email will look.",
  audienceTitle: "Audience",
  recipients: "Estimated recipients",
  consentNote:
    "Only followers who allowed emails from places they follow are included.",
  noPromotion: "No promotion featured",
  footer: "You get this email because you follow",
  unsubscribe: "Unsubscribe",
  cancel: "Cancel campaign",
  edit: "Edit",
  statsAfterSend: "Open and click numbers appear after the campaign is sent.",
};
