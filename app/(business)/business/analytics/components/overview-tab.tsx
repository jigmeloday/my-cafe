import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { FunnelChart } from "@/components/business/charts/funnel-chart";
import { PerformanceChart } from "@/components/business/charts/performance-chart";
import type { BarItem } from "@/components/business/charts/model/chart.type";
import { SectionCard } from "@/components/business/section-card";

import { ANALYTICS_COPY, BANNER_METRICS, METRICS } from "../constant/analytics.constant";
import type { BannerDay, Dataset, RangeDays } from "../model/analytics.type";
import {
  previousReach,
  rangeDays,
  rangeReach,
  rangeTotals,
  previousTotals,
  sourceRows,
  toPoints,
} from "../utils/dataset.utils";
import { bannerPoints } from "../utils/banner.utils";
import { AnalyticsStats } from "./analytics-stats";
import { CoinsCard } from "./coins-card";

interface TabProps {
  data: Dataset;
  banners: BannerDay[];
  range: RangeDays;
  coins: BarItem[];
}

export function OverviewTab({ data, banners, range, coins }: TabProps) {
  const totals = rangeTotals(data, range);

  return (
    <div className="space-y-4">
      <AnalyticsStats current={totals} previous={previousTotals(data, range)} reach={{ current: rangeReach(data, range), previous: previousReach(data, range) }} />
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
      <PerformanceChart title={ANALYTICS_COPY.bannerChartTitle} points={bannerPoints(banners, range)} metrics={BANNER_METRICS} />
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
        <CoinsCard rows={coins} />
      </div>
    </div>
  );
}
