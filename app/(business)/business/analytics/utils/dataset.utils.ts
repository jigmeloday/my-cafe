import type { BarItem, ChartPoint } from "@/components/business/charts/model/chart.type";

import type { PromotionEventKind } from "@/lib/track-events";
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
  type: PromotionEventKind;
  source: string;
  /** "YYYY-MM-DD" */
  day: string;
  count: number;
}

/** Seats reserved at one event on one day. */
export interface ReservationCount {
  promotionId: string;
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
  reach: { day: string; visitors: number }[] = [],
  reservations: ReservationCount[] = [],
): Dataset {
  const labels = lastDays(endDate, count);
  const index = new Map(labels.map((d, i) => [d.date, i]));
  const blank = (): DayStats[] => labels.map((d) => ({ ...d, views: 0, clicks: 0, saves: 0, shares: 0, chats: 0, reservations: 0 }));

  const days = blank();
  const promotions: Dataset["promotions"] = Object.fromEntries(promotionIds.map((id) => [id, blank()]));
  const sources: Dataset["sources"] = Object.fromEntries(SOURCES.map((s) => [s.id, labels.map(() => 0)]));

  for (const e of events) {
    const i = index.get(e.day);
    const own = promotions[e.promotionId];
    if (i === undefined || !own) continue;
    const field = e.type === "VIEW" ? "views" : e.type === "SHARE" ? "shares" : e.type === "WHATSAPP" ? "chats" : "clicks";
    own[i][field] += e.count;
    days[i][field] += e.count;
    if (e.type === "CLICK") sources[SOURCE_IDS.includes(e.source) ? e.source : OTHER_SOURCE][i] += e.count;
  }
  for (const r of reservations) {
    const i = index.get(r.day);
    const own = promotions[r.promotionId];
    if (i === undefined || !own) continue;
    own[i].reservations += r.count;
    days[i].reservations += r.count;
  }
  for (const s of saves) {
    const i = index.get(s.day);
    const own = promotions[s.promotionId];
    if (i === undefined || !own) continue;
    own[i].saves += 1;
    days[i].saves += 1;
  }
  const reachByDay: number[] = labels.map(() => 0);
  for (const r of reach) {
    const i = index.get(r.day);
    if (i !== undefined) reachByDay[i] = r.visitors;
  }
  return { days, promotions, sources, reach: reachByDay };
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
  days.map(({ label, views, clicks, saves, shares, chats, reservations }) => ({ label, values: { views, clicks, saves, shares, chats, reservations } }));

export const promotionPoints = (data: Dataset, id: string, range: RangeDays): ChartPoint[] =>
  toPoints(lastN(data.promotions[id] ?? [], range));

export const rangeTotals = (data: Dataset, range: RangeDays): Totals => totalsOf(lastN(data.days, range));

/** Different people reached in the last `range` days. A person back on two days counts twice, as codes change daily. */
export const rangeReach = (data: Dataset, range: RangeDays) => sum(lastN(data.reach, range));
export const previousReach = (data: Dataset, range: RangeDays) => sum(data.reach.slice(-range * 2, -range));

export const previousTotals = (data: Dataset, range: RangeDays): Totals => {
  const previous = data.days.slice(-range * 2, -range);
  return previous.length ? totalsOf(previous) : emptyTotals();
};
