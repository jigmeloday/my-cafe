import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PerformanceChart } from "../../dashboard/components/performance-chart";
import { CampaignDetailHeader } from "../components/campaign-detail-header";
import { CampaignSettings } from "../components/campaign-settings";
import { CampaignStats } from "../components/campaign-stats";
import { RecentClicks } from "../components/recent-clicks";
import { findCampaign } from "../constant/campaigns.data";
import { sampleDailyPoints } from "../utils/campaign.utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `${findCampaign(id)?.name ?? "Campaign"} — kuzu business` };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = findCampaign(id);
  if (!campaign) notFound();
  const points = sampleDailyPoints(campaign);

  return (
    <div className="space-y-6">
      <CampaignDetailHeader item={campaign} />
      <CampaignStats item={campaign} />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        {points.length > 0 ? (
          <PerformanceChart points={points} />
        ) : (
          <RecentClicks hasClicks={false} />
        )}
        <CampaignSettings item={campaign} />
      </div>
      {points.length > 0 && <RecentClicks hasClicks />}
    </div>
  );
}
