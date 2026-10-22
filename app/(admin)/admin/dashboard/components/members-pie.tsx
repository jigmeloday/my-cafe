import { PieChart } from "@/components/business/charts/pie-chart";
import { SectionCard } from "@/components/business/section-card";
import type { Overview } from "@/services/admin/admin-overview.service";

import { DASHBOARD_COPY } from "../constant/dashboard.constant";

/** How many customers and how many businesses are on the site. */
export function MembersPie({ totals }: Pick<Overview, "totals">) {
  return (
    <SectionCard title={DASHBOARD_COPY.membersTitle} description={DASHBOARD_COPY.membersHint}>
      <PieChart
        label={DASHBOARD_COPY.membersTitle}
        totalLabel="in total"
        slices={[
          { id: "customers", label: "Customers", value: totals.customers },
          { id: "businesses", label: "Businesses", value: totals.businesses },
        ]}
      />
    </SectionCard>
  );
}
