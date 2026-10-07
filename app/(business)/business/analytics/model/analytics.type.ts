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

export interface BannerRun {
  id: string;
  promotionId: string;
  /** First day, "YYYY-MM-DD". */
  start: string;
  days: number;
  /** Coins paid for the whole run. */
  coins: number;
}

export interface PromotionMeta {
  id: string;
  title: string;
  type: string;
  ended: boolean;
}

export interface PromotionStatsRow extends PromotionMeta, Totals {}

export interface BannerRunRow extends BannerRun {
  title: string;
  active: boolean;
  impressions: number;
  clicks: number;
}

/** Everything is built from daily numbers, so any range adds up exactly. */
export interface Dataset {
  days: DayStats[];
  /** Per promotion id, one entry per day (same order as `days`). */
  promotions: Record<string, DayStats[]>;
  /** Per source id, clicks per day. */
  sources: Record<string, number[]>;
  bannerClicks: number[];
  bannerImpressions: number[];
}
