import type { Metadata } from "next";
import { requireRole } from "@/lib/session";

import { BusinessesExplorer } from "./components/businesses-explorer";
import { BUSINESSES_COPY } from "./constant/business.constant";

export const metadata: Metadata = { title: "Businesses — kuzu admin" };

export default async function AdminBusinessesPage() {
  // The layout checks this too, but a page must not rely on that.
  await requireRole("ADMIN");

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{BUSINESSES_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">
          {BUSINESSES_COPY.subtitle}{" "}
          <span className="text-xs">{BUSINESSES_COPY.sampleNote}</span>
        </p>
      </header>
      <BusinessesExplorer />
    </div>
  );
}
