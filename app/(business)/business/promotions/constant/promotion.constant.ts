import { FEATURED_DAYS, featuredPrice } from "@/lib/featured";
import {
  CTA_TYPES,
  DEFAULT_REGISTRATION_LABEL,
  PROMOTION_STATUSES,
  PROMOTION_TYPES,
} from "@/lib/constants";

import type { PromotionInput } from "@/lib/validations/promotion.schema";

import type { OptionItem, PromotionFilters } from "../model/promotion.type";

const TYPE_LABELS: Record<(typeof PROMOTION_TYPES)[number], string> = {
  DEAL: "Deal",
  SALE: "Sale",
  EVENT: "Event",
  PRODUCT: "Product",
  SERVICE: "Service",
  GIVEAWAY: "Giveaway",
  ANNOUNCEMENT: "Announcement",
};

const CTA_LABELS: Record<(typeof CTA_TYPES)[number], string> = {
  VIEW_OFFER: "View offer",
  VISIT_WEBSITE: "Visit website",
  CONTACT_BUSINESS: "Contact business",
  WHATSAPP: "Chat on WhatsApp",
};

export const STATUS_LABELS: Record<
  (typeof PROMOTION_STATUSES)[number],
  string
> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ENDED: "Ended",
};

export const STATUS_TONES = {
  DRAFT: "neutral",
  PUBLISHED: "success",
  ENDED: "neutral",
} as const;

export const TYPE_OPTIONS: OptionItem[] = PROMOTION_TYPES.map((value) => ({
  value,
  label: TYPE_LABELS[value],
}));
export const CTA_OPTIONS: OptionItem[] = CTA_TYPES.map((value) => ({
  value,
  label: CTA_LABELS[value],
}));

export const TYPE_FILTER_OPTIONS: OptionItem[] = [
  { value: "ALL", label: "All types" },
  ...TYPE_OPTIONS,
];
export const STATUS_FILTERS = [
  { id: "ALL", label: "All" },
  ...PROMOTION_STATUSES.map((id) => ({ id, label: STATUS_LABELS[id] })),
];

export const DEFAULT_FILTERS: PromotionFilters = {
  query: "",
  status: "ALL",
  type: "ALL",
};
export const DESCRIPTION_MAX = 1000;
export const MAX_PHOTOS = 5;

/** What the two dates mean, by type: for an event they are its days; for anything else, how long the promotion is shown. */
export const SCHEDULE_COPY = {
  event: {
    title: "How long it's shown & where",
    start: "Show on Nook from",
    end: "Show on Nook until",
    hint: "Your event is listed on Nook on these days, up to the event's last day. You pay coins for each day it is listed.",
  },
  promotion: {
    title: "Promotion dates & place",
    start: "Promotion starts",
    end: "Promotion ends",
    hint: "People see your promotion on these days, then it ends. You pay coins for each day it is shown.",
  },
};

export const EVENT_DATES_COPY = {
  title: "When is the event?",
  description: "The days and times people will see on your event page. This is separate from how long it is shown on Nook.",
  start: "Event starts",
  end: "Event ends",
  endHint: "Leave empty for a one-day event.",
  startTime: "Start time (optional)",
  endTime: "End time (optional)",
};

/** The ways an event can take reservations, as the organiser picks them. */
export const REGISTRATION_MODE_OPTIONS = [
  { value: "NONE", title: "No reservations", text: "People just read the details and come along." },
  { value: "NOOK", title: "Reserve a seat here on Nook", text: "People sign in and reserve. You see who is coming under Guest lists, and can download the list." },
  { value: "EXTERNAL", title: "Reserve on another website", text: "You already take bookings or sell tickets elsewhere. Add the link and people go there." },
] as const;

export const PROMOTIONS_COPY = {
  registrationTitle: "Reservations",
  registrationDescription: "Do people need to reserve a place? You can take reservations here, or send them to your own website.",
  title: "Promotions",
  subtitle:
    "What you're offering. Publish it for free, then tell your followers about it with an email campaign.",
  create: "Create promotion",
  searchPlaceholder: "Search promotions",
  firstTitle: "No promotions yet",
  firstDescription: "Create your first promotion to show it on Nook.",
  emptyTitle: "No promotions match",
  emptyDescription:
    "Try a different search or filter, or create a new promotion.",
  newTitle: "New promotion",
  newSubtitle: "Describe your offer and publish it for free.",
  editTitle: "Edit promotion",
  editSubtitle: "Changes appear on your public page once saved.",
  back: "Promotions",
  saveDraft: "Save as draft",
  publish: "Publish",
  previewTitle: "Preview",
  previewHint: "How it looks in discovery.",
  photosHint: "Up to 5 photos. The first one is used as the cover.",
};

export const NEW_PROMOTION: PromotionInput = {
  title: "",
  type: "DEAL",
  discount: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  category: "",
  ctaType: "VIEW_OFFER",
  ctaUrl: "",
  photos: [],
  featureDays: "0",
  featureStart: "",
  status: "DRAFT",
  eventStartDate: "",
  eventEndDate: "",
  eventStartTime: "",
  eventEndTime: "",
  registrationMode: "NONE",
  registrationUrl: "",
  registrationLabel: DEFAULT_REGISTRATION_LABEL,
  capacity: "",
};

/** "Not featured", "1 day · 50 coins", "3 days · 150 coins"... */
export const FEATURE_OPTIONS = [
  { value: "0", label: "Not featured" },
  ...FEATURED_DAYS.map((d) => ({ value: d, label: `${d} ${d === "1" ? "day" : "days"} · ${featuredPrice(Number(d)).toLocaleString("en")} coins` })),
];

export const FEATURE_COPY = {
  title: "Feature on the home page",
  description: "Show this promotion in the Featured row on the home page. Paid on top of publishing.",
  note: (slots: number) => `Only ${slots} promotions can be featured on any one day, so busy days sell out. The row shows a few at a time and rotates on every visit.`,
};

export const PUBLISH_COPY = {
  title: "Publishing",
  description: "You pay coins for each day your promotion runs, from its start date to its end date. Drafts are free.",
  alreadyLive: "This promotion is already live, so saving changes is free. Moving the end date later costs coins for the extra days.",
  perDay: (days: number, perDay: number) => `${days} ${days === 1 ? "day" : "days"} × ${perDay} coins`,
  needDates: "Choose a start and end date to see the cost.",
  cost: "Cost to publish",
};
