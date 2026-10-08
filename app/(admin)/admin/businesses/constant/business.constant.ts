import type { StatusTone } from "@/components/shared/status-badge";
import { BUSINESS_STATUSES } from "@/lib/constants";

import type { BusinessFilters, BusinessStatus } from "../model/business.type";

export const BUSINESS_STATUS: Record<
  BusinessStatus,
  { label: string; tone: StatusTone }
> = {
  PENDING: { label: "Needs review", tone: "warning" },
  VERIFIED: { label: "Verified", tone: "success" },
  SUSPENDED: { label: "Suspended", tone: "danger" },
};

export const STATUS_FILTERS = [
  { id: "ALL", label: "All" },
  ...BUSINESS_STATUSES.map((id) => ({ id, label: BUSINESS_STATUS[id].label })),
];

export const DEFAULT_FILTERS: BusinessFilters = { query: "", status: "ALL" };

export const BUSINESSES_COPY = {
  title: "Businesses",
  subtitle: "Check new businesses and keep the marketplace trustworthy.",
  sampleNote: "Sample data.",
  searchPlaceholder: "Search by business, owner or email",
  emptyTitle: "No businesses match",
  emptyDescription: "Try a different search or filter.",
};
