import { CATEGORIES } from "@/components/public/constant/site.constant";
import {
  CTA_TYPES,
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
export const CATEGORY_OPTIONS: OptionItem[] = CATEGORIES.map(({ label }) => ({
  value: label,
  label,
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

export const PROMOTIONS_COPY = {
  title: "Promotions",
  subtitle:
    "What you're offering. Publish it for free, then tell your followers about it with an email campaign.",
  create: "Create promotion",
  searchPlaceholder: "Search promotions",
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
  emailFollowers: false,
  bannerDays: "0",
  topRankDays: "0",
  status: "DRAFT",
};

export const PROMOTE_COPY = {
  title: "Reach more people",
  description:
    "Optional. Publishing is free. Spend coins to tell your followers or to be seen first.",
  emailLabel: "Email my followers",
  emailHint:
    "Followers who agreed to emails get a message about this promotion.",
  bannerLabel: "Homepage banner",
  topRankLabel: "Rank at the top",
  free: "Publishing is free. Add extras above to reach more people.",
  total: "Total in coins",
};
