import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/formatters/date";
import type { ActionResult } from "@/server/actions/action.type";

import { DECISION, REASON_LABELS } from "../constant/report.constant";
import type { Report } from "../model/report.type";
import { ReportActions } from "./report-actions";

interface ReportCardProps {
  report: Report;
  onResult: (result: ActionResult) => void;
}

export function ReportCard({ report, onResult }: ReportCardProps) {
  const decision = report.decision ? DECISION[report.decision] : null;

  return (
    <li className="space-y-3 rounded-xl border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <Link
            href={`/promotions/${report.promotionSlug}`}
            className="block font-semibold hover:underline"
          >
            {report.promotionTitle}
          </Link>
          <p className="text-sm text-muted-foreground">{report.businessName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="warning">
            {REASON_LABELS[report.reason]}
          </StatusBadge>
          {decision && (
            <StatusBadge tone={decision.tone}>{decision.label}</StatusBadge>
          )}
        </div>
      </div>
      <p className="text-sm">“{report.details}”</p>
      <p className="text-xs text-muted-foreground">
        {report.count} {report.count === 1 ? "report" : "reports"} · first
        reported {formatDateTime(report.firstReported)}
      </p>
      {report.status === "OPEN" && (
        <ReportActions report={report} onResult={onResult} />
      )}
    </li>
  );
}
