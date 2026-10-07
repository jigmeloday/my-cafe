import type { Metadata } from "next";

import { DashboardCharts } from "./components/dashboard-charts";
import { DashboardHeader } from "./components/dashboard-header";
import { PromotionsList } from "./components/promotions-list";
import { RecentCampaigns } from "./components/recent-campaigns";
import { StatsGrid } from "./components/stats-grid";

export const metadata: Metadata = { title: "Overview — kuzu business" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsGrid />
      <DashboardCharts />
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentCampaigns />
        <PromotionsList />
      </div>
    </div>
  );
}
