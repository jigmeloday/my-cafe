/** Why an ad can be reported, in the order shown in the form. The ids match the `ReportReason` database values. */
export const REPORT_REASONS = [
  { id: "MISLEADING", label: "Misleading or false offer" },
  { id: "WRONG_PRICE", label: "Wrong price or terms" },
  { id: "SCAM", label: "Scam or fraud" },
  { id: "SPAM", label: "Spam or repeated posts" },
  { id: "OFFENSIVE", label: "Offensive or inappropriate" },
  { id: "CLOSED", label: "Business closed or doesn't exist" },
  { id: "OTHER", label: "Something else" },
] as const;

export type ReportReasonId = (typeof REPORT_REASONS)[number]["id"];

export const REASON_LABEL: Record<ReportReasonId, string> = Object.fromEntries(REPORT_REASONS.map((r) => [r.id, r.label])) as Record<ReportReasonId, string>;

/** How many ads one person may report in an hour. Stops report-flooding. */
export const REPORTS_PER_HOUR = 10;
