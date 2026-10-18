import type { BarItem, ChartPoint } from "@/components/business/charts/model/chart.type";

import { OTHER_SOURCE, SOURCES } from "../constant/analytics.constant";
import type {
  Dataset,
  DayStats,
  PromotionMeta,
  PromotionStatsRow,
  RangeDays,
  Totals,
} from "../model/analytics.type";
import { emptyTotals, lastDays, sum, totalsOf } from "./analytics.utils";

export interface EventCount {
  promotionId: string;
  type: "VIEW" | "CLICK";
  source: string;
  /** "YYYY-MM-DD" */
  day: string;
  count: number;
}

export interface SaveCount {
  promotionId: string;
  day: string;
}

const SOURCE_IDS: string[] = SOURCES.map((s) => s.id);

/**
 * Turns counted events into the per-day series the screens use. Counts that fall outside the days shown,
 * or belong to a promotion that isn't listed, are ignored. A source we don't know counts as "other".
 */
export function buildDataset(
  endDate: string,
  count: number,
  promotionIds: string[],
  events: EventCount[],
  saves: SaveCount[],
): Dataset {
  const labels = lastDays(endDate, count);
  const index = new Map(labels.map((d, i) => [d.date, i]));
  const blank = (): DayStats[] => labels.map((d) => ({ ...d, views: 0, clicks: 0, saves: 0 }));

  const days = blank();
  const promotions: Dataset["promotions"] = Object.fromEntries(promotionIds.map((id) => [id, blank()]));
  const sources: Dataset["sources"] = Object.fromEntries(SOURCES.map((s) => [s.id, labels.map(() => 0)]));

  for (const e of events) {
    const i = index.get(e.day);
    const own = promotions[e.promotionId];
    if (i === undefined || !own) continue;
    const field = e.type === "VIEW" ? "views" : "clicks";
    own[i][field] += e.count;
    days[i][field] += e.count;
    if (e.type === "CLICK") sources[SOURCE_IDS.includes(e.source) ? e.source : OTHER_SOURCE][i] += e.count;
  }
  for (const s of saves) {
    const i = index.get(s.day);
    const own = promotions[s.promotionId];
    if (i === undefined || !own) continue;
    own[i].saves += 1;
    days[i].saves += 1;
  }
  return { days, promotions, sources };
}

const lastN = <T>(items: T[], range: RangeDays) => items.slice(-range);

export const rangeDays = (data: Dataset, range: RangeDays) => lastN(data.days, range);

export function sourceRows(data: Dataset, range: RangeDays): BarItem[] {
  return SOURCES.map((s) => ({ id: s.id, label: s.label, value: sum(lastN(data.sources[s.id], range)) }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function promotionRows(data: Dataset, range: RangeDays, metas: PromotionMeta[]): PromotionStatsRow[] {
  return metas
    .filter((m) => data.promotions[m.id])
    .map((m) => ({ ...m, ...totalsOf(lastN(data.promotions[m.id], range)) }))
    .sort((a, b) => b.clicks - a.clicks);
}

export const toPoints = (days: DayStats[]): ChartPoint[] =>
  days.map(({ label, views, clicks, saves }) => ({ label, values: { views, clicks, saves } }));

export const promotionPoints = (data: Dataset, id: string, range: RangeDays): ChartPoint[] =>
  toPoints(lastN(data.promotions[id] ?? [], range));

export const rangeTotals = (data: Dataset, range: RangeDays): Totals => totalsOf(lastN(data.days, range));

export const previousTotals = (data: Dataset, range: RangeDays): Totals => {
  const previous = data.days.slice(-range * 2, -range);
  return previous.length ? totalsOf(previous) : emptyTotals();
};
