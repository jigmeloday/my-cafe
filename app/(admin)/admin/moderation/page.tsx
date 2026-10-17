import type { Metadata } from "next";

import { ReportsExplorer } from "./components/reports-explorer";
import { MODERATION_COPY } from "./constant/report.constant";

export const metadata: Metadata = { title: "Moderation — kuzu admin" };

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{MODERATION_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">
          {MODERATION_COPY.subtitle}{" "}
          <span className="text-xs">{MODERATION_COPY.sampleNote}</span>
        </p>
      </header>
      <ReportsExplorer />
    </div>
  );
}
