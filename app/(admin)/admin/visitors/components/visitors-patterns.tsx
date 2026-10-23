import { BarChart } from "@/components/business/charts/bar-chart";
import { SectionCard } from "@/components/business/section-card";
import type { VisitorsReport } from "@/services/admin/admin-traffic.service";

import { VISITORS_COPY } from "../constant/visitors.constant";
import { hourItems, weekdayItems } from "../utils/visitors.utils";

/** When people come: by hour of the day, and by day of the week. */
export function VisitorsPatterns({ report }: { report: VisitorsReport }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard title={VISITORS_COPY.hoursTitle} description={VISITORS_COPY.hoursHint}>
        <BarChart items={hourItems(report.hours)} kind="number" label={VISITORS_COPY.hoursHint} />
      </SectionCard>
      <SectionCard title={VISITORS_COPY.weekdaysTitle} description={VISITORS_COPY.weekdaysHint}>
        <BarChart items={weekdayItems(report)} kind="number" label={VISITORS_COPY.weekdaysHint} />
      </SectionCard>
    </div>
  );
}
