import { StatCard } from "@/components/business/stat-card";

import { DAILY_POINTS } from "../constant/dashboard.data";
import { getSummary } from "../utils/dashboard.utils";

export function StatsGrid() {
  return (
    <section
      aria-label="Summary"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {getSummary(DAILY_POINTS).map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
