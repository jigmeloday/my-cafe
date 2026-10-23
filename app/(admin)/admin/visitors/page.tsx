import type { Metadata } from "next";

import { requireRole } from "@/lib/session";
import { adminTrafficService } from "@/services/admin/admin-traffic.service";

import { RangeChips } from "./components/range-chips";
import { VisitorsCharts } from "./components/visitors-charts";
import { VisitorsPatterns } from "./components/visitors-patterns";
import { VisitorsStats } from "./components/visitors-stats";
import { VisitorsTop } from "./components/visitors-top";
import { VISITORS_COPY } from "./constant/visitors.constant";
import { parseRange } from "./utils/visitors.utils";

export const metadata: Metadata = { title: "Visitors — Nook admin" };

export default async function AdminVisitorsPage({ searchParams }: PageProps<"/admin/visitors">) {
  // The layout also checks this, but a page must not rely on that: it runs its own queries.
  await requireRole("ADMIN");
  const range = parseRange((await searchParams).range);
  const report = await adminTrafficService.get(range.days);

  return (
    <div className="space-y-6">
      <header className="max-w-2xl space-y-1">
        <h1>{VISITORS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{VISITORS_COPY.subtitle}</p>
      </header>
      <RangeChips active={range.id} />
      <VisitorsStats report={report} />
      <VisitorsCharts report={report} />
      <VisitorsPatterns report={report} />
      <VisitorsTop report={report} />
      <p className="text-xs text-muted-foreground">{VISITORS_COPY.note}</p>
    </div>
  );
}
