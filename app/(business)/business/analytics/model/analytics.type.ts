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
  /** Different people who viewed or clicked any promotion, per day (same order as `days`). */
  reach: number[];
}

/** One day on the business's own page. */
export interface ProfileDay {
  date: string;
  label: string;
  /** Times the page was opened. */
  visits: number;
  /** Different people who opened or clicked it that day. */
  visitors: number;
  /** Clicks on the phone, email, website or social links. */
  clicks: number;
}

export interface ProfileData {
  days: ProfileDay[];
  /** Per kind of click ("CALL", "EMAIL"...), clicks per day (same order as `days`). */
  clicks: Record<string, number[]>;
  /** Per source id, visits per day (same order as `days`). */
  sources: Record<string, number[]>;
}
