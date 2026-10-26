import { PerformanceChart } from "@/components/business/charts/performance-chart";
import { StatCard } from "@/components/business/stat-card";
import { formatNumber, formatPercent } from "@/lib/formatters/number";

import { INSIGHT_METRICS, REGISTRATIONS_COPY as COPY } from "../constant/registrations.constant";

interface EventInsightsProps {
  views: number;
  reserved: number;
  perDay: { label: string; reservations: number }[];
}

/** How the event is doing: how many looked, how many reserved, and when the reservations came in. */
export function EventInsights({ views, reserved, perDay }: EventInsightsProps) {
  return (
    <section aria-label="How this event is doing" className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={COPY.pageViews} value={formatNumber(views)} hint={COPY.viewsHint} />
        <StatCard label={COPY.viewsToSeats} value={views === 0 ? "—" : formatPercent(reserved / views, 1)} hint={COPY.viewsToSeatsHint} />
      </div>
      <PerformanceChart title={COPY.perDayTitle} points={perDay.map((d) => ({ label: d.label, values: { reservations: d.reservations } }))} metrics={INSIGHT_METRICS} />
    </section>
  );
}
