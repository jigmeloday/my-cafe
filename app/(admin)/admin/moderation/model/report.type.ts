import type { REPORT_DECISIONS, REPORT_STATUSES } from "@/lib/constants";

export type ReportStatus = (typeof REPORT_STATUSES)[number];
export type ReportDecision = (typeof REPORT_DECISIONS)[number];
export type ReportReason =
  "MISLEADING" | "WRONG_PRICE" | "SPAM" | "OFFENSIVE" | "CLOSED";

export interface Report {
  id: string;
  promotionTitle: string;
  /** Public page: /promotions/{promotionSlug} */
  promotionSlug: string;
  businessName: string;
  reason: ReportReason;
  details: string;
  /** How many people reported it. */
  count: number;
  /** "YYYY-MM-DDTHH:mm" */
  firstReported: string;
  status: ReportStatus;
  decision?: ReportDecision;
}

export type ReportFilter = ReportStatus | "ALL";
