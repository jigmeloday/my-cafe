import type { StatusTone } from "@/components/shared/status-badge";

import type { ReportDecision, ReportFilter } from "../model/report.type";

export const DECISION: Record<ReportDecision, { label: string; tone: StatusTone }> = {
  DISMISSED: { label: "Dismissed", tone: "neutral" },
  WARNED: { label: "Business warned", tone: "warning" },
  REMOVED: { label: "Ad removed", tone: "danger" },
};

export const FILTERS: { id: ReportFilter; label: string }[] = [
  { id: "OPEN", label: "Open" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "ALL", label: "All" },
];

export const DEFAULT_FILTER: ReportFilter = "OPEN";

export const KIND_LABEL = { promotion: "Promotion", banner: "Banner" } as const;

export const MODERATION_COPY = {
  title: "Moderation",
  subtitle: "Review promotions and banners that people have reported.",
  searchPlaceholder: "Search by ad or business",
  emptyTitle: "Nothing to review",
  emptyDescription: "No reports match this view.",
  dismiss: "Dismiss",
  warn: "Warn business",
  remove: "Remove ad",
  removeTitle: "Remove this ad?",
  removeConfirm: "Remove",
};
