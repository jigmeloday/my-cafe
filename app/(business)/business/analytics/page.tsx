import type { Metadata } from "next";

import { AnalyticsExplorer } from "./components/analytics-explorer";
import { ANALYTICS_COPY } from "./constant/analytics.constant";

export const metadata: Metadata = { title: "Analytics — kuzu business" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{ANALYTICS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">
          {ANALYTICS_COPY.subtitle}{" "}
          <span className="text-xs">{ANALYTICS_COPY.sampleNote}</span>
        </p>
      </header>
      <AnalyticsExplorer />
    </div>
  );
}
