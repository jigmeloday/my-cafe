import { StatCard } from "@/components/business/stat-card";
import type { Overview } from "@/services/admin/admin-overview.service";

import { getSummary } from "../utils/dashboard.utils";

export function StatsGrid({ overview }: { overview: Overview }) {
  return (
    <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {getSummary(overview).map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
