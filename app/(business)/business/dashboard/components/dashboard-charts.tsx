import { PerformanceChart } from "@/components/business/charts/performance-chart";

import { METRICS } from "../../analytics/constant/analytics.constant";
import { CHART_TITLES, FOLLOWER_METRIC } from "../constant/dashboard.constant";
import { followerPoints, performancePoints } from "../utils/dashboard.utils";

export function DashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PerformanceChart
        title={CHART_TITLES.performance}
        points={performancePoints()}
        metrics={METRICS}
      />
      <PerformanceChart
        title={CHART_TITLES.followers}
        points={followerPoints()}
        metrics={[FOLLOWER_METRIC]}
      />
    </div>
  );
}
