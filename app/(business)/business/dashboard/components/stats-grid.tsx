import { StatCard } from "@/components/business/stat-card";

import type { SummaryStat } from "../model/dashboard.type";

export function StatsGrid({ stats }: { stats: SummaryStat[] }) {
  return (
    <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
