import type { ChartPoint } from "@/components/business/charts/model/chart.type";
import { coinPriceMinor } from "@/lib/coins";
import { formatMoney } from "@/lib/formatters/currency";
import { formatNumber } from "@/lib/formatters/number";

import { buildSampleDays } from "@/app/(business)/business/analytics/utils/analytics.utils";
import { ADMIN_BUSINESSES } from "../../businesses/constant/businesses.data";
import { REPORTS } from "../../moderation/constant/reports.data";
import { ADMIN_USERS } from "../../users/constant/users.data";
import { PERIOD_DAYS, PLATFORM_TOTALS } from "../constant/dashboard.constant";
import type { AttentionItem, DaySeries } from "../model/dashboard.type";

/**
 * Sample daily numbers for the last 60 days, oldest first. Integer maths only, so the server and
 * the browser always agree. One coin purchase a day keeps revenue consistent with the price tiers.
 */
export function buildSeries(): DaySeries[] {
  return buildSampleDays().map(({ label }, i) => {
    const coins = 100 * (1 + ((i * 37) % 9));
    return {
      label,
      users: 6 + ((i * 7) % 5) + Math.floor(i / 8),
      businesses: 1 + ((i * 5) % 3) + (Math.floor(i / 10) % 2),
      coins,
      revenueMinor: coinPriceMinor(coins),
    };
  });
}

const sum = (days: DaySeries[], pick: (d: DaySeries) => number) =>
  days.reduce((t, d) => t + pick(d), 0);
const change = (now: number, before: number) =>
  before === 0 ? undefined : (now - before) / before;

export function periods(series: DaySeries[]) {
  return {
    current: series.slice(-PERIOD_DAYS),
    previous: series.slice(-PERIOD_DAYS * 2, -PERIOD_DAYS),
  };
}

export function getSummary(series: DaySeries[]) {
  const { current, previous } = periods(series);
  const stat = (pick: (d: DaySeries) => number) => ({
    now: sum(current, pick),
    delta: change(sum(current, pick), sum(previous, pick)),
  });
  const users = stat((d) => d.users);
  const businesses = stat((d) => d.businesses);
  const coins = stat((d) => d.coins);
  const revenue = stat((d) => d.revenueMinor);

  return [
    {
      label: "New users",
      value: formatNumber(users.now),
      delta: users.delta,
      hint: `${formatNumber(PLATFORM_TOTALS.users)} in total`,
    },
    {
      label: "New businesses",
      value: formatNumber(businesses.now),
      delta: businesses.delta,
      hint: `${formatNumber(PLATFORM_TOTALS.businesses)} in total`,
    },
    {
      label: "Coins sold",
      value: formatNumber(coins.now),
      delta: coins.delta,
      hint: "last 30 days",
    },
    {
      label: "Revenue",
      value: formatMoney(revenue.now),
      delta: revenue.delta,
      hint: "from coin sales",
    },
  ];
}

export const signupPoints = (series: DaySeries[]): ChartPoint[] =>
  periods(series).current.map((d) => ({
    label: d.label,
    values: { users: d.users, businesses: d.businesses },
  }));

export const revenuePoints = (series: DaySeries[]): ChartPoint[] =>
  periods(series).current.map((d) => ({
    label: d.label,
    values: { revenue: d.revenueMinor, coins: d.coins },
  }));

export function attentionItems(): AttentionItem[] {
  return [
    {
      id: "pending",
      label: "Businesses waiting for review",
      count: ADMIN_BUSINESSES.filter((b) => b.status === "PENDING").length,
      href: "/admin/businesses",
    },
    {
      id: "reports",
      label: "Open reports to review",
      count: REPORTS.filter((r) => r.status === "OPEN").length,
      href: "/admin/moderation",
    },
    {
      id: "suspended-businesses",
      label: "Suspended businesses",
      count: ADMIN_BUSINESSES.filter((b) => b.status === "SUSPENDED").length,
      href: "/admin/businesses",
    },
    {
      id: "suspended-users",
      label: "Suspended users",
      count: ADMIN_USERS.filter((u) => u.status === "SUSPENDED").length,
      href: "/admin/users",
    },
  ];
}

export const newestBusinesses = (limit = 5) =>
  [...ADMIN_BUSINESSES]
    .sort((a, b) => (a.joined < b.joined ? 1 : -1))
    .slice(0, limit);
