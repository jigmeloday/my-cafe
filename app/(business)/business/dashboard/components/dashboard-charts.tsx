import { PerformanceChart } from "@/components/business/charts/performance-chart";
import type { ChartPoint } from "@/components/business/charts/model/chart.type";

import { METRICS } from "../../analytics/constant/analytics.constant";
import { CHART_TITLES, FOLLOWER_METRIC } from "../constant/dashboard.constant";

interface DashboardChartsProps {
  performance: ChartPoint[];
  followers: ChartPoint[];
}

export function DashboardCharts({ performance, followers }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PerformanceChart title={CHART_TITLES.performance} points={performance} metrics={METRICS} />
      <PerformanceChart title={CHART_TITLES.followers} points={followers} metrics={[FOLLOWER_METRIC]} />
    </div>
  );
}
