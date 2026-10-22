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

/** Bhutanese ngultrum (Nu.), shown as "Nu. 1,250". */
export const DEFAULT_CURRENCY = "BTN";

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
  "WHATSAPP",
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

export const USER_ROLES = ["USER", "BUSINESS_OWNER", "ADMIN"] as const;
export const USER_STATUSES = ["ACTIVE", "SUSPENDED"] as const;
export const BUSINESS_STATUSES = ["PENDING", "VERIFIED", "SUSPENDED"] as const;
export const REPORT_STATUSES = ["OPEN", "RESOLVED"] as const;
export const REPORT_DECISIONS = ["DISMISSED", "REMOVED", "WARNED"] as const;

export const INTERESTS = [
  "Food & drink", "Cafés", "Fashion", "Electronics", "Wellness", "Stays",
  "Music", "Culture", "Kids", "Sports", "Books", "Crafts",
] as const;
