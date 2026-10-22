import type { BarItem, ChartPoint } from "@/components/business/charts/model/chart.type";
import { formatNumber } from "@/lib/formatters/number";
import type { Overview, OverviewDay } from "@/services/admin/admin-overview.service";

import { PERIOD_DAYS, SECTION_LABELS } from "../constant/dashboard.constant";
import type { AttentionItem } from "../model/dashboard.type";

const sum = (days: OverviewDay[], pick: (d: OverviewDay) => number) => days.reduce((t, d) => t + pick(d), 0);
const change = (now: number, before: number) => (before === 0 ? undefined : (now - before) / before);

/** The last 30 days, and the 30 before them (for "vs the previous period"). */
export function periods(days: OverviewDay[]) {
  return { current: days.slice(-PERIOD_DAYS), previous: days.slice(-PERIOD_DAYS * 2, -PERIOD_DAYS) };
}

export function getSummary({ days, totals }: Pick<Overview, "days" | "totals">) {
  const { current, previous } = periods(days);
  const stat = (pick: (d: OverviewDay) => number) => ({ now: sum(current, pick), delta: change(sum(current, pick), sum(previous, pick)) });
  const users = stat((d) => d.users);
  const businesses = stat((d) => d.businesses);
  const spent = stat((d) => d.coinsSpent);

  return [
    { label: "New users", value: formatNumber(users.now), delta: users.delta, hint: `${formatNumber(totals.users)} in total` },
    { label: "New businesses", value: formatNumber(businesses.now), delta: businesses.delta, hint: `${formatNumber(totals.businesses)} in total` },
    { label: "Live promotions", value: formatNumber(totals.livePromotions), hint: `${formatNumber(totals.runningBanners)} ${totals.runningBanners === 1 ? "banner" : "banners"} running` },
    { label: "Coins spent", value: formatNumber(spent.now), delta: spent.delta, hint: "last 30 days, by businesses" },
  ];
}

export const signupPoints = (days: OverviewDay[]): ChartPoint[] =>
  periods(days).current.map((d) => ({ label: d.label, values: { users: d.users, businesses: d.businesses } }));

export const coinPoints = (days: OverviewDay[]): ChartPoint[] =>
  periods(days).current.map((d) => ({ label: d.label, values: { coinsAdded: d.coinsAdded, coinsSpent: d.coinsSpent } }));

export function attentionItems({ totals, openReports }: Pick<Overview, "totals" | "openReports">): AttentionItem[] {
  return [
    { id: "verification", label: "Verification requests waiting", count: totals.pendingVerifications, href: "/admin/verification" },
    { id: "banner-review", label: "Banners waiting for review", count: totals.bannersToReview, href: "/admin/banners" },
    { id: "messages", label: "Messages waiting for a reply", count: totals.openMessages, href: "/admin/messages" },
    { id: "reports", label: "Open reports to review", count: openReports, href: "/admin/moderation" },
    { id: "suspended-businesses", label: "Suspended businesses", count: totals.suspendedBusinesses, href: "/admin/businesses" },
    { id: "suspended-users", label: "Suspended users", count: totals.suspendedUsers, href: "/admin/users" },
  ];
}

export const trafficPoints = (days: OverviewDay[]): ChartPoint[] =>
  periods(days).current.map((d) => ({ label: d.label, values: { visitors: d.visitors, visits: d.visits } }));

/** The four numbers at the top of the traffic section. */
export function trafficSummary(days: OverviewDay[]) {
  const { current, previous } = periods(days);
  const today = days.at(-1);
  const visitors = sum(current, (d) => d.visitors);
  const visits = sum(current, (d) => d.visits);
  return [
    { label: "Visitors today", value: formatNumber(today?.visitors ?? 0), hint: `${formatNumber(today?.visits ?? 0)} pages opened` },
    { label: "Visitors", value: formatNumber(visitors), delta: change(visitors, sum(previous, (d) => d.visitors)), hint: "last 30 days" },
    { label: "Pages opened", value: formatNumber(visits), delta: change(visits, sum(previous, (d) => d.visits)), hint: "last 30 days" },
    { label: "Pages per visitor", value: visitors === 0 ? "0" : (visits / visitors).toFixed(1), hint: "last 30 days" },
  ];
}

export const sectionRows = (sections: Overview["sections"]): BarItem[] =>
  sections.map(({ section, visits }) => ({ id: section, label: SECTION_LABELS[section] ?? section, value: visits }));
