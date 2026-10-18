import type { Metadata } from "next";

import { requireRole } from "@/lib/session";
import { analyticsService } from "@/services/analytics/analytics.service";

import { AnalyticsExplorer } from "./components/analytics-explorer";
import { ANALYTICS_COPY } from "./constant/analytics.constant";

export const metadata: Metadata = { title: "Analytics — kuzu business" };

export default async function AnalyticsPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const analytics = await analyticsService.forOwner(user.id);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{ANALYTICS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{ANALYTICS_COPY.subtitle}</p>
      </header>
      <AnalyticsExplorer analytics={analytics} />
    </div>
  );
}
