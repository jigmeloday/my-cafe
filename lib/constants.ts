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

/**
 * The kinds of promotion a business can pick for a new one. "PRODUCT" and "GIVEAWAY" below still exist, so a promotion
 * that already has one of them keeps working and keeps its label, but they are no longer offered.
 */
export const SELECTABLE_PROMOTION_TYPES = ["DEAL", "SALE", "EVENT", "SERVICE", "ANNOUNCEMENT"] as const;

export const PROMOTION_TYPES = [
  "DEAL",
  "SALE",
  "EVENT",
  "PRODUCT",
  "SERVICE",
  "GIVEAWAY",
  "ANNOUNCEMENT",
] as const;

/**
 * How many days after an event ends the names and phone numbers people shared to reserve a seat are removed
 * (`npm run purge:registrations`). Only the count stays. The Privacy Policy and the guest list page state this number.
 */
export const REGISTRATION_RETENTION_DAYS = 30;

/** How an event takes reservations: not at all (just come along), here on Nook, or on another website. */
export const REGISTRATION_MODES = ["NONE", "NOOK", "EXTERNAL"] as const;

/** What the reserve-a-seat button on an event says unless the organiser changes it. */
export const DEFAULT_REGISTRATION_LABEL = "Reserve my seat";

/** The types people can order from: a deal or a sale item. */
export const ORDERABLE_TYPES = ["DEAL", "SALE"] as const;

/** How a deal or sale item takes orders: not at all, here on Nook, in a WhatsApp chat, or on the seller's own website. */
export const ORDER_MODES = ["NONE", "NOOK", "WHATSAPP", "EXTERNAL"] as const;

/** What the order button says unless the seller changes it. */
export const DEFAULT_ORDER_LABEL = "Order now";

/** The most of one item a person can order at once. */
export const MAX_ORDER_QUANTITY = 20;

/** The most unfinished orders one person can have for one item, so a form can't be used to flood a seller. */
export const MAX_OPEN_ORDERS = 5;

/**
 * How many days after an order is finished (completed or cancelled) the name, phone and note the customer shared are
 * removed (`npm run purge:orders`). The order stays for the seller's totals. The Privacy Policy states this number.
 */
export const ORDER_RETENTION_DAYS = 30;

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
