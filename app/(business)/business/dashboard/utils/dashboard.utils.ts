import type { ChartPoint } from "@/components/business/charts/model/chart.type";
import { formatNumber, formatPercent } from "@/lib/formatters/number";

import {
  buildSampleDays,
  splitRange,
} from "../../analytics/utils/analytics.utils";
import { toPoints } from "../../analytics/utils/dataset.utils";
import { FOLLOWERS_TOTAL } from "../../campaigns/constant/email-campaign.constant";
import { EMAIL_CAMPAIGNS } from "../../campaigns/constant/email-campaigns.data";
import { PROMOTION_ITEMS } from "../../promotions/constant/promotions.data";
import {
  FOLLOWER_DAYS,
  PERFORMANCE_DAYS,
} from "../constant/dashboard.constant";
import type { SummaryStat } from "../model/dashboard.type";

const SAMPLE_DAYS = buildSampleDays();

/** Views, clicks and saves for the last N days, in the shape the shared chart expects. */
export const performancePoints = (days = PERFORMANCE_DAYS): ChartPoint[] =>
  toPoints(splitRange(SAMPLE_DAYS, days as 7 | 14 | 30).current);

/**
 * Follower count per day, ending at today's total. Sample data: new followers per day are 0 to 2
 * (integer maths only, so the server and browser agree), counted backwards from FOLLOWERS_TOTAL.
 */
export function followerPoints(days = FOLLOWER_DAYS): ChartPoint[] {
  const labels = SAMPLE_DAYS.slice(-days).map((d) => d.label);
  let total = FOLLOWERS_TOTAL;
  const counts: number[] = [];
  for (let i = labels.length - 1; i >= 0; i--) {
    counts[i] = total;
    total -= (i * 7 + 3) % 3;
  }
  return labels.map((label, i) => ({
    label,
    values: { followers: counts[i] },
  }));
}

export function getSummary(): SummaryStat[] {
  const sent = EMAIL_CAMPAIGNS.filter((c) => c.status === "SENT");
  const emails = sent.reduce((total, c) => total + c.recipients, 0);
  const opened = sent.reduce((total, c) => total + c.opened, 0);
  const live = PROMOTION_ITEMS.filter((p) => p.status === "PUBLISHED").length;
  const followers = followerPoints();
  const first = followers[0].values.followers;
  const last = followers[followers.length - 1].values.followers;

  return [
    {
      label: "Followers",
      value: formatNumber(last),
      delta: first === 0 ? undefined : (last - first) / first,
      hint: `vs ${FOLLOWER_DAYS} days ago`,
    },
    {
      label: "Live promotions",
      value: String(live),
      hint: `${PROMOTION_ITEMS.length} in total`,
    },
    { label: "Emails sent", value: formatNumber(emails), hint: "all time" },
    {
      label: "Average open rate",
      value: formatPercent(emails ? opened / emails : 0, 1),
      hint: "across sent campaigns",
    },
  ];
}
