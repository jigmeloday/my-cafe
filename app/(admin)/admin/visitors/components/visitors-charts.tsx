import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { PerformanceChart } from "@/components/business/charts/performance-chart";
import { SectionCard } from "@/components/business/section-card";
import type { VisitorsReport } from "@/services/admin/admin-traffic.service";

import { VISITORS_COPY, VISITOR_METRICS } from "../constant/visitors.constant";
import { sectionRows, visitorPoints } from "../utils/visitors.utils";

/** Visitors day by day, next to which parts of the site they open. */
export function VisitorsCharts({ report }: { report: VisitorsReport }) {
  const rows = sectionRows(report.sections);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <PerformanceChart title={VISITORS_COPY.chartTitle} points={visitorPoints(report)} metrics={VISITOR_METRICS} />
      <SectionCard title={VISITORS_COPY.sectionsTitle}>
        {rows.length > 0 ? <BreakdownList rows={rows} /> : <p className="text-sm text-muted-foreground">{VISITORS_COPY.none}</p>}
      </SectionCard>
    </div>
  );
}
