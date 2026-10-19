import type { ReportItem } from "@/services/report/report.service";

export type { ReportItem as Report };

export type ReportStatus = ReportItem["status"];
export type ReportDecision = NonNullable<ReportItem["decision"]>;
export type ReportFilter = ReportStatus | "ALL";
