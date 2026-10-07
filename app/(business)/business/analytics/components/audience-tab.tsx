import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { SectionCard } from "@/components/business/section-card";
import { formatNumber } from "@/lib/formatters/number";

import { FOLLOWERS_TOTAL } from "../../campaigns/constant/email-campaign.constant";
import { ANALYTICS_COPY } from "../constant/analytics.constant";
import { interestRows, locationRows, reachRows } from "../utils/audience.utils";

export function AudienceTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        You have{" "}
        <span className="font-semibold text-foreground">
          {formatNumber(FOLLOWERS_TOTAL)}
        </span>{" "}
        followers right now.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SectionCard title={ANALYTICS_COPY.locationsTitle}>
          <BreakdownList rows={locationRows()} />
        </SectionCard>
        <SectionCard
          title={ANALYTICS_COPY.interestsTitle}
          description="People can pick several, so these overlap."
        >
          <BreakdownList rows={interestRows()} showShare={false} />
        </SectionCard>
        <SectionCard
          title={ANALYTICS_COPY.reachTitle}
          description="Only followers who agreed to emails receive your campaigns."
        >
          <BreakdownList rows={reachRows()} />
        </SectionCard>
      </div>
    </div>
  );
}
