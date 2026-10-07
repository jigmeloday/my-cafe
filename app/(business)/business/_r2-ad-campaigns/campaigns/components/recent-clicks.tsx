import { SectionCard } from "@/components/business/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatMoney } from "@/lib/formatters/currency";

import { DETAIL_COPY } from "../constant/campaign.constant";
import { RECENT_CLICKS } from "../constant/campaigns.data";

export function RecentClicks({ hasClicks }: { hasClicks: boolean }) {
  return (
    <SectionCard
      title={DETAIL_COPY.clicksTitle}
      description={hasClicks ? DETAIL_COPY.filteredNote : undefined}
    >
      {hasClicks ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 font-medium">When</th>
                <th className="py-2 font-medium">From</th>
                <th className="py-2 font-medium">Result</th>
                <th className="py-2 text-right font-medium">Charged</th>
              </tr>
            </thead>
            <tbody className="divide-y tabular-nums">
              {RECENT_CLICKS.map((click) => (
                <tr key={click.id}>
                  <td className="py-2.5">{click.time}</td>
                  <td className="py-2.5 text-muted-foreground">
                    {click.source}
                  </td>
                  <td className="py-2.5">
                    <StatusBadge tone={click.valid ? "success" : "neutral"}>
                      {click.valid ? DETAIL_COPY.valid : DETAIL_COPY.filtered}
                    </StatusBadge>
                  </td>
                  <td className="py-2.5 text-right">
                    {formatMoney(click.chargedMinor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{DETAIL_COPY.noClicks}</p>
      )}
    </SectionCard>
  );
}
