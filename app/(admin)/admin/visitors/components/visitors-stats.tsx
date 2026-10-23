import { StatCard } from "@/components/business/stat-card";
import type { VisitorsReport } from "@/services/admin/admin-traffic.service";

import { visitorStats } from "../utils/visitors.utils";

export function VisitorsStats({ report }: { report: Pick<VisitorsReport, "days" | "rangeDays"> }) {
  return (
    <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {visitorStats(report).map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
