import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { SectionCard } from "@/components/business/section-card";
import { formatNumber } from "@/lib/formatters/number";
import type { Audience } from "@/services/analytics/analytics.service";

import { ANALYTICS_COPY } from "../constant/analytics.constant";

const NONE = "Nobody follows you yet.";

export function AudienceTab({ audience }: { audience: Audience }) {
  const { followers, locations, interests, reach } = audience;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You have <span className="font-semibold text-foreground">{formatNumber(followers)}</span>{" "}
        {followers === 1 ? "follower" : "followers"} right now.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SectionCard title={ANALYTICS_COPY.locationsTitle}>
          {locations.length > 0 ? <BreakdownList rows={locations} /> : <p className="text-sm text-muted-foreground">{NONE}</p>}
        </SectionCard>
        <SectionCard title={ANALYTICS_COPY.interestsTitle} description="People can pick several, so these overlap.">
          {interests.length > 0 ? <BreakdownList rows={interests} showShare={false} /> : <p className="text-sm text-muted-foreground">Followers have not shared interests yet.</p>}
        </SectionCard>
        <SectionCard title={ANALYTICS_COPY.reachTitle} description="Only followers who agreed to emails can receive them.">
          {reach.length > 0 ? <BreakdownList rows={reach} /> : <p className="text-sm text-muted-foreground">{NONE}</p>}
        </SectionCard>
      </div>
    </div>
  );
}
