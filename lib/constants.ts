export const ACCOUNT_TYPES = ["USER", "BUSINESS_OWNER"] as const;

export const GENDERS = [
  "female",
  "male",
  "other",
  "prefer_not_to_say",
] as const;

export const CONTACT_METHODS = ["email", "phone", "whatsapp"] as const;

export const DZONGKHAGS = [
  "Bumthang",
  "Chhukha",
  "Dagana",
  "Gasa",
  "Haa",
  "Lhuentse",
  "Mongar",
  "Paro",
  "Pemagatshel",
  "Punakha",
  "Samdrup Jongkhar",
  "Samtse",
  "Sarpang",
  "Thimphu",
  "Trashigang",
  "Trashiyangtse",
  "Trongsa",
  "Tsirang",
  "Wangdue Phodrang",
  "Zhemgang",
] as const;

export const DEFAULT_CURRENCY = "USD";

export const CAMPAIGN_STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const PROMOTION_TYPES = [
  "DEAL",
  "SALE",
  "EVENT",
  "PRODUCT",
  "SERVICE",
  "GIVEAWAY",
  "ANNOUNCEMENT",
] as const;

export const PROMOTION_STATUSES = ["DRAFT", "PUBLISHED", "ENDED"] as const;

// This release is discovery only, so call-to-actions never buy or book.
export const CTA_TYPES = [
  "VIEW_OFFER",
  "VISIT_WEBSITE",
  "CONTACT_BUSINESS",
] as const;

export const CAMPAIGN_DESTINATIONS = [
  "PROMOTION",
  "PROFILE",
  "CUSTOM",
] as const;
export const CAMPAIGN_SCHEDULES = ["ALWAYS", "WEEKENDS"] as const;

/** Smallest cost-per-click a business can set, in minor units (10 = $0.10). */
export const MIN_CPC_MINOR = 10;

export const EMAIL_CAMPAIGN_STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "SENT",
  "CANCELLED",
] as const;
export const SEND_MODES = ["NOW", "LATER"] as const;
