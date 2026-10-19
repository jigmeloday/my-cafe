export type RangeDays = 7 | 14 | 30;

export interface DayStats {
  /** "YYYY-MM-DD" */
  date: string;
  /** "5 Oct" */
  label: string;
  views: number;
  clicks: number;
  saves: number;
}

export interface Totals {
  views: number;
  clicks: number;
  saves: number;
}

export interface PromotionMeta {
  id: string;
  title: string;
  type: string;
  ended: boolean;
}

export interface PromotionStatsRow extends PromotionMeta, Totals {}

/** Everything is built from daily numbers, so any range adds up exactly. */
export interface Dataset {
  days: DayStats[];
  /** Per promotion id, one entry per day (same order as `days`). */
  promotions: Record<string, DayStats[]>;
  /** Per source id, clicks per day (same order as `days`). */
  sources: Record<string, number[]>;
}
