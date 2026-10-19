import { formatNumber } from "@/lib/formatters/number";
import { discoveryService } from "@/services/discovery/discovery.service";

import { ABOUT_COPY } from "../constant/about.constant";

/** Real totals from the database. Shown only once there is something to count, so it never says "0 businesses". */
export async function AboutStats() {
  const stats = await discoveryService.siteStats();
  if (stats.businesses === 0) return null;

  const items = [
    { label: stats.businesses === 1 ? "business" : "businesses", value: stats.businesses },
    { label: stats.deals === 1 ? "live deal" : "live deals", value: stats.deals },
    { label: stats.events === 1 ? "event coming up" : "events coming up", value: stats.events },
    { label: "verified", value: stats.verified },
  ].filter((item) => item.value > 0);

  return (
    <section aria-labelledby="stats" className="space-y-4">
      <h2 id="stats">{ABOUT_COPY.statsTitle}</h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-muted p-5">
            <dd className="text-3xl font-semibold tracking-tight tabular-nums">{formatNumber(value)}</dd>
            <dt className="text-sm text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
