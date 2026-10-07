import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { FunnelChart } from "@/components/business/charts/funnel-chart";
import { PerformanceChart } from "@/components/business/charts/performance-chart";
import { SectionCard } from "@/components/business/section-card";

import { ANALYTICS_COPY, METRICS } from "../constant/analytics.constant";
import type { Dataset, RangeDays } from "../model/analytics.type";
import {
  rangeDays,
  rangeTotals,
  previousTotals,
  sourceRows,
  toPoints,
} from "../utils/dataset.utils";
import { AnalyticsStats } from "./analytics-stats";
import { CoinsCard } from "./coins-card";

interface TabProps {
  data: Dataset;
  range: RangeDays;
}

export function OverviewTab({ data, range }: TabProps) {
  const totals = rangeTotals(data, range);

  return (
    <div className="space-y-4">
      <AnalyticsStats current={totals} previous={previousTotals(data, range)} />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <PerformanceChart
          title={ANALYTICS_COPY.chartTitle}
          points={toPoints(rangeDays(data, range))}
          metrics={METRICS}
        />
        <SectionCard title={ANALYTICS_COPY.sourcesTitle}>
          <BreakdownList rows={sourceRows(data, range)} />
        </SectionCard>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title={ANALYTICS_COPY.funnelTitle}>
          <FunnelChart
            label={ANALYTICS_COPY.funnelTitle}
            stages={[
              { id: "views", label: "Views", value: totals.views },
              { id: "clicks", label: "Clicks", value: totals.clicks },
              { id: "saves", label: "Saves", value: totals.saves },
            ]}
          />
        </SectionCard>
        <CoinsCard />
      </div>
    </div>
  );
}
