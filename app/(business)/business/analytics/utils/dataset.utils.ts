import type { BarItem } from "@/components/business/charts/model/chart.type";
import type { ChartPoint } from "@/components/business/charts/model/chart.type";

import {
  BANNER_CLICK_SHARE,
  BANNER_RUNS,
  BANNER_SOURCE,
  PROMOTION_WEIGHTS,
  SOURCE_WEIGHTS,
} from "../constant/analytics.constant";
import type {
  BannerRunRow,
  Dataset,
  DayStats,
  PromotionMeta,
  PromotionStatsRow,
  RangeDays,
  Totals,
} from "../model/analytics.type";
import {
  addDays,
  apportion,
  buildSampleDays,
  emptyTotals,
  sum,
  totalsOf,
} from "./analytics.utils";

const PROMOTION_IDS = Object.keys(PROMOTION_WEIGHTS);

const bannerActiveOn = (date: string) =>
  BANNER_RUNS.some(
    (run) => date >= run.start && date <= addDays(run.start, run.days - 1),
  );

/** Builds every per-day series. Each split is exact, so totals always match the sum of the parts. */
export function buildDataset(days: DayStats[] = buildSampleDays()): Dataset {
  const promotions: Dataset["promotions"] = Object.fromEntries(
    PROMOTION_IDS.map((id) => [id, [] as DayStats[]]),
  );
  const sources: Dataset["sources"] = Object.fromEntries(
    SOURCE_WEIGHTS.map((s) => [s.id, [] as number[]]),
  );
  const bannerClicks: number[] = [];
  const bannerImpressions: number[] = [];

  days.forEach((day, i) => {
    const views = apportion(
      day.views,
      PROMOTION_IDS.map((id) => PROMOTION_WEIGHTS[id].views),
    );
    const clicks = apportion(
      day.clicks,
      PROMOTION_IDS.map((id) => PROMOTION_WEIGHTS[id].clicks),
    );
    const saves = apportion(
      day.saves,
      PROMOTION_IDS.map((id) => PROMOTION_WEIGHTS[id].saves),
    );
    PROMOTION_IDS.forEach((id, p) => {
      promotions[id].push({
        date: day.date,
        label: day.label,
        views: views[p],
        clicks: clicks[p],
        saves: saves[p],
      });
    });

    const fromBanner = bannerActiveOn(day.date)
      ? Math.floor((day.clicks * BANNER_CLICK_SHARE) / 100)
      : 0;
    const rest = apportion(
      day.clicks - fromBanner,
      SOURCE_WEIGHTS.map((s) => s.weight),
    );
    SOURCE_WEIGHTS.forEach((s, k) => sources[s.id].push(rest[k]));
    bannerClicks.push(fromBanner);
    // Banner click-through rate varies from about 2.2% to 3.6%.
    bannerImpressions.push(
      fromBanner === 0
        ? 0
        : Math.round((fromBanner * 1000) / (28 + ((i * 7) % 15))),
    );
  });

  return { days, promotions, sources, bannerClicks, bannerImpressions };
}

const lastN = <T>(items: T[], range: RangeDays) => items.slice(-range);

export const rangeDays = (data: Dataset, range: RangeDays) =>
  lastN(data.days, range);

export function sourceRows(data: Dataset, range: RangeDays): BarItem[] {
  const rows = SOURCE_WEIGHTS.map((s) => ({
    id: s.id,
    label: s.label,
    value: sum(lastN(data.sources[s.id], range)),
  }));
  rows.push({
    id: BANNER_SOURCE.id,
    label: BANNER_SOURCE.label,
    value: sum(lastN(data.bannerClicks, range)),
  });
  return rows.sort((a, b) => b.value - a.value);
}

export function promotionRows(
  data: Dataset,
  range: RangeDays,
  metas: PromotionMeta[],
): PromotionStatsRow[] {
  return metas
    .filter((m) => data.promotions[m.id])
    .map((m) => ({ ...m, ...totalsOf(lastN(data.promotions[m.id], range)) }))
    .sort((a, b) => b.clicks - a.clicks);
}

export const toPoints = (days: DayStats[]): ChartPoint[] =>
  days.map(({ label, views, clicks, saves }) => ({
    label,
    values: { views, clicks, saves },
  }));

export const promotionPoints = (
  data: Dataset,
  id: string,
  range: RangeDays,
): ChartPoint[] => toPoints(lastN(data.promotions[id] ?? [], range));

export const bannerPoints = (data: Dataset, range: RangeDays): ChartPoint[] =>
  lastN(data.days, range).map((day, i, shown) => {
    const offset = data.days.length - shown.length + i;
    return {
      label: day.label,
      values: {
        impressions: data.bannerImpressions[offset],
        clicks: data.bannerClicks[offset],
      },
    };
  });

export function bannerTotals(
  data: Dataset,
  range: RangeDays,
): { impressions: number; clicks: number } {
  return {
    impressions: sum(lastN(data.bannerImpressions, range)),
    clicks: sum(lastN(data.bannerClicks, range)),
  };
}

/** Every banner run with the results recorded so far. */
export function bannerRunRows(
  data: Dataset,
  titleOf: (promotionId: string) => string,
): BannerRunRow[] {
  const today = data.days[data.days.length - 1].date;
  return BANNER_RUNS.map((run) => {
    const end = addDays(run.start, run.days - 1);
    const inRun = data.days
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => d.date >= run.start && d.date <= end);
    return {
      ...run,
      title: titleOf(run.promotionId),
      active: end >= today,
      impressions: sum(inRun.map(({ i }) => data.bannerImpressions[i])),
      clicks: sum(inRun.map(({ i }) => data.bannerClicks[i])),
    };
  }).sort((a, b) => (a.start < b.start ? 1 : -1));
}

export const rangeTotals = (data: Dataset, range: RangeDays): Totals =>
  totalsOf(lastN(data.days, range));
export const previousTotals = (data: Dataset, range: RangeDays): Totals => {
  const previous = data.days.slice(-range * 2, -range);
  return previous.length ? totalsOf(previous) : emptyTotals();
};
