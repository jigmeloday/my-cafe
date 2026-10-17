import type { Metadata } from "next";

import { AttentionCard } from "./components/attention-card";
import { DashboardCharts } from "./components/dashboard-charts";
import { RecentBusinesses } from "./components/recent-businesses";
import { StatsGrid } from "./components/stats-grid";
import { DASHBOARD_COPY } from "./constant/dashboard.constant";

export const metadata: Metadata = { title: "Overview — kuzu admin" };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{DASHBOARD_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">
          {DASHBOARD_COPY.subtitle}{" "}
          <span className="text-xs">{DASHBOARD_COPY.sampleNote}</span>
        </p>
      </header>
      <StatsGrid />
      <DashboardCharts />
      <div className="grid gap-4 lg:grid-cols-2">
        <AttentionCard />
        <RecentBusinesses />
      </div>
    </div>
  );
}
