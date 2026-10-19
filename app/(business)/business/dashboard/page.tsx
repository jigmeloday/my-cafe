import type { Metadata } from "next";

import { requireRole } from "@/lib/session";
import { analyticsService } from "@/services/analytics/analytics.service";
import { reportService } from "@/services/report/report.service";
import { promotionService } from "@/services/promotion/promotion.service";

import { DashboardCharts } from "./components/dashboard-charts";
import { DashboardHeader } from "./components/dashboard-header";
import { PromotionsList } from "./components/promotions-list";
import { NoticesCard } from "./components/notices-card";
import { StatsGrid } from "./components/stats-grid";
import { FOLLOWER_DAYS } from "./constant/dashboard.constant";
import { clicksByPromotion, getSummary, performancePoints } from "./utils/dashboard.utils";

export const metadata: Metadata = { title: "Overview — kuzu business" };

export default async function DashboardPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const [{ data }, followers, promotions, notices] = await Promise.all([
    analyticsService.forOwner(user.id),
    analyticsService.followerSeries(user.id, FOLLOWER_DAYS),
    promotionService.list(user.id),
    reportService.noticesFor(user.id),
  ]);
  const live = promotions.filter((p) => p.status === "PUBLISHED").length;

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <NoticesCard notices={notices} />
      <StatsGrid stats={getSummary({ data, followers: followers.points, live, total: promotions.length })} />
      <DashboardCharts performance={performancePoints(data)} followers={followers.points} />
      <PromotionsList items={promotions} clicks={clicksByPromotion(data)} />
    </div>
  );
}
