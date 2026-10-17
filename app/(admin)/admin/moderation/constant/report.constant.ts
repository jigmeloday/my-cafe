import type { StatusTone } from "@/components/shared/status-badge";

import type {
  ReportDecision,
  ReportFilter,
  ReportReason,
} from "../model/report.type";

export const REASON_LABELS: Record<ReportReason, string> = {
  MISLEADING: "Misleading offer",
  WRONG_PRICE: "Wrong price",
  SPAM: "Spam",
  OFFENSIVE: "Offensive content",
  CLOSED: "Business closed",
};

export const DECISION: Record<
  ReportDecision,
  { label: string; tone: StatusTone }
> = {
  DISMISSED: { label: "Dismissed", tone: "neutral" },
  WARNED: { label: "Business warned", tone: "warning" },
  REMOVED: { label: "Promotion removed", tone: "danger" },
};

export const FILTERS: { id: ReportFilter; label: string }[] = [
  { id: "OPEN", label: "Open" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "ALL", label: "All" },
];

export const DEFAULT_FILTER: ReportFilter = "OPEN";

export const MODERATION_COPY = {
  title: "Moderation",
  subtitle: "Review promotions that people have reported.",
  sampleNote: "Sample data.",
  searchPlaceholder: "Search by promotion or business",
  emptyTitle: "Nothing to review",
  emptyDescription: "No reports match this view.",
  dismiss: "Dismiss",
  warn: "Warn business",
  remove: "Remove promotion",
  removeTitle: "Remove this promotion?",
  removeConfirm: "Remove",
};
