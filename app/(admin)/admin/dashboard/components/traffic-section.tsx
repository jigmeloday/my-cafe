import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { PerformanceChart } from "@/components/business/charts/performance-chart";
import { SectionCard } from "@/components/business/section-card";
import { StatCard } from "@/components/business/stat-card";
import type { Overview } from "@/services/admin/admin-overview.service";

import { DASHBOARD_COPY, TRAFFIC_METRICS } from "../constant/dashboard.constant";
import { sectionRows, trafficPoints, trafficSummary } from "../utils/dashboard.utils";

/** How many people visit Nook and which parts they open, for the whole site. */
export function TrafficSection({ overview }: { overview: Pick<Overview, "days" | "sections"> }) {
  const rows = sectionRows(overview.sections);

  return (
    <section aria-label="Traffic" className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {trafficSummary(overview.days).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <PerformanceChart title={DASHBOARD_COPY.trafficTitle} points={trafficPoints(overview.days)} metrics={TRAFFIC_METRICS} />
        <SectionCard title={DASHBOARD_COPY.sectionsTitle}>
          {rows.length > 0 ? <BreakdownList rows={rows} /> : <p className="text-sm text-muted-foreground">{DASHBOARD_COPY.noTraffic}</p>}
        </SectionCard>
      </div>
      <p className="text-xs text-muted-foreground">{DASHBOARD_COPY.trafficNote}</p>
    </section>
  );
}
