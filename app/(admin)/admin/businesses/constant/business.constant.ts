import type { StatusTone } from "@/components/shared/status-badge";

import type { BusinessFilter, BusinessStatus, VerificationState } from "../model/business.type";

export const BUSINESS_STATUS: Record<BusinessStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "Needs review", tone: "warning" },
  VERIFIED: { label: "Verified", tone: "success" },
  SUSPENDED: { label: "Suspended", tone: "danger" },
};

export const VERIFICATION_LABEL: Record<VerificationState, { label: string; tone: StatusTone }> = {
  NONE: { label: "Not sent", tone: "neutral" },
  WAITING: { label: "Waiting for review", tone: "warning" },
  SENT_BACK: { label: "Sent back", tone: "danger" },
  APPROVED: { label: "Approved", tone: "success" },
};

export const FILTERS: { id: BusinessFilter; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: BUSINESS_STATUS.PENDING.label },
  { id: "VERIFIED", label: BUSINESS_STATUS.VERIFIED.label },
  { id: "SUSPENDED", label: BUSINESS_STATUS.SUSPENDED.label },
];

/** How long to wait after the last keystroke before searching. */
export const SEARCH_DELAY_MS = 400;

export const BUSINESSES_COPY = {
  title: "Businesses",
  subtitle: "Check new businesses and keep kuzu trustworthy.",
  searchPlaceholder: "Search by business, owner, email or town",
  searchHint: "Try several words, e.g. \"druk pizza\".",
  emptyTitle: "No businesses match",
  emptyDescription: "Try a different search or filter.",
};
