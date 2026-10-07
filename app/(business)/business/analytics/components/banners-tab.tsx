import { PerformanceChart } from "@/components/business/charts/performance-chart";
import { StatCard } from "@/components/business/stat-card";
import {
  formatCoins,
  formatNumber,
  formatPercent,
} from "@/lib/formatters/number";

import {
  ANALYTICS_COPY,
  BANNER_METRICS,
  BANNER_RUNS,
} from "../constant/analytics.constant";
import type { Dataset, RangeDays } from "../model/analytics.type";
import {
  bannerPoints,
  bannerRunRows,
  bannerTotals,
} from "../utils/dataset.utils";
import { promotionTitle } from "../utils/promotion-meta.utils";
import { BannerRunsTable } from "./banner-runs-table";

export function BannersTab({
  data,
  range,
}: {
  data: Dataset;
  range: RangeDays;
}) {
  const inRange = bannerTotals(data, range);
  const runs = bannerRunRows(data, promotionTitle);
  const allClicks = runs.reduce((sum, r) => sum + r.clicks, 0);
  const coins = BANNER_RUNS.reduce((sum, r) => sum + r.coins, 0);
  const coinsPerClick = allClicks
    ? (Math.round((coins * 10) / allClicks) / 10).toFixed(1)
    : "—";

  return (
    <div className="space-y-4">
      <section
        aria-label="Banner summary"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <StatCard
          label="Banner impressions"
          value={formatNumber(inRange.impressions)}
          hint="in this period"
        />
        <StatCard
          label="Banner clicks"
          value={formatNumber(inRange.clicks)}
          hint="in this period"
        />
        <StatCard
          label="Click-through rate"
          value={
            inRange.impressions
              ? formatPercent(inRange.clicks / inRange.impressions, 1)
              : "—"
          }
          hint="in this period"
        />
        <StatCard
          label="Coins per click"
          value={coinsPerClick}
          hint={`${formatCoins(coins)} spent in total`}
        />
      </section>
      {inRange.impressions > 0 ? (
        <PerformanceChart
          title={ANALYTICS_COPY.bannerChartTitle}
          points={bannerPoints(data, range)}
          metrics={BANNER_METRICS}
        />
      ) : (
        <p className="rounded-xl border bg-surface p-4 text-sm text-muted-foreground">
          {ANALYTICS_COPY.noBanner}
        </p>
      )}
      <section aria-labelledby="banner-runs" className="space-y-3">
        <h2 id="banner-runs">{ANALYTICS_COPY.bannerRunsTitle}</h2>
        <BannerRunsTable rows={runs} />
      </section>
    </div>
  );
}
