import { PerformanceChart } from "@/components/business/charts/performance-chart";

import {
  DASHBOARD_COPY,
  REVENUE_METRICS,
  SIGNUP_METRICS,
} from "../constant/dashboard.constant";
import {
  buildSeries,
  revenuePoints,
  signupPoints,
} from "../utils/dashboard.utils";

const SERIES = buildSeries();

export function DashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PerformanceChart
        title={DASHBOARD_COPY.signupsTitle}
        points={signupPoints(SERIES)}
        metrics={SIGNUP_METRICS}
      />
      <PerformanceChart
        title={DASHBOARD_COPY.revenueTitle}
        points={revenuePoints(SERIES)}
        metrics={REVENUE_METRICS}
      />
    </div>
  );
}
