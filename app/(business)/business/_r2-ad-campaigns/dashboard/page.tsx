import type { Metadata } from "next";

import { DAILY_POINTS } from "./constant/dashboard.data";
import { CampaignsTable } from "./components/campaigns-table";
import { DashboardHeader } from "./components/dashboard-header";
import { PerformanceChart } from "./components/performance-chart";
import { PromotionsList } from "./components/promotions-list";
import { StatsGrid } from "./components/stats-grid";
import { WalletCard } from "./components/wallet-card";

export const metadata: Metadata = { title: "Overview — kuzu business" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsGrid />
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <PerformanceChart points={DAILY_POINTS} />
        <WalletCard />
      </div>
      <CampaignsTable />
      <PromotionsList />
    </div>
  );
}
