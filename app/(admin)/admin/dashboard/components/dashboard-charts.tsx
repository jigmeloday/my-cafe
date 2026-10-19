import { PerformanceChart } from "@/components/business/charts/performance-chart";
import type { OverviewDay } from "@/services/admin/admin-overview.service";

import { COIN_METRICS, DASHBOARD_COPY, SIGNUP_METRICS } from "../constant/dashboard.constant";
import { coinPoints, signupPoints } from "../utils/dashboard.utils";

export function DashboardCharts({ days }: { days: OverviewDay[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PerformanceChart title={DASHBOARD_COPY.signupsTitle} points={signupPoints(days)} metrics={SIGNUP_METRICS} />
      <PerformanceChart title={DASHBOARD_COPY.coinsTitle} points={coinPoints(days)} metrics={COIN_METRICS} />
    </div>
  );
}
