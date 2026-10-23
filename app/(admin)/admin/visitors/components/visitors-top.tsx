import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { SectionCard } from "@/components/business/section-card";
import type { VisitorsReport } from "@/services/admin/admin-traffic.service";

import { VISITORS_COPY } from "../constant/visitors.constant";

/** What people look at most: businesses and promotions. */
export function VisitorsTop({ report }: { report: Pick<VisitorsReport, "topBusinesses" | "topPromotions"> }) {
  const businesses = report.topBusinesses.map((b) => ({ id: b.id, label: b.name, value: b.views }));
  const promotions = report.topPromotions.map((p) => ({ id: p.id, label: p.title, value: p.views }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard title={VISITORS_COPY.businessesTitle}>
        {businesses.length > 0 ? <BreakdownList rows={businesses} showShare={false} /> : <p className="text-sm text-muted-foreground">{VISITORS_COPY.none}</p>}
      </SectionCard>
      <SectionCard title={VISITORS_COPY.promotionsTitle}>
        {promotions.length > 0 ? <BreakdownList rows={promotions} showShare={false} /> : <p className="text-sm text-muted-foreground">{VISITORS_COPY.none}</p>}
      </SectionCard>
    </div>
  );
}
