import { StatCard } from "@/components/business/stat-card";

import { buildSeries, getSummary } from "../utils/dashboard.utils";

const SERIES = buildSeries();

export function StatsGrid() {
  return (
    <section
      aria-label="Summary"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {getSummary(SERIES).map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
