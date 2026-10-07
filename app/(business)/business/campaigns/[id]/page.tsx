import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CampaignDetailHeader } from "../components/campaign-detail-header";
import { CampaignDetailsCard } from "../components/campaign-details-card";
import { CampaignStats } from "../components/campaign-stats";
import { EmailPreview } from "../components/email-preview";
import { findEmailCampaign } from "../constant/email-campaigns.data";

export async function generateMetadata({
  params,
}: PageProps<"/business/campaigns/[id]">): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${findEmailCampaign(id)?.name ?? "Campaign"} — kuzu business`,
  };
}

export default async function CampaignDetailPage({
  params,
}: PageProps<"/business/campaigns/[id]">) {
  const { id } = await params;
  const campaign = findEmailCampaign(id);
  if (!campaign) notFound();

  return (
    <div className="space-y-6">
      <CampaignDetailHeader item={campaign} />
      <CampaignStats item={campaign} />
      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <EmailPreview
          subject={campaign.subject}
          previewText={campaign.previewText}
          body={campaign.body}
          promotionId={campaign.promotionId}
        />
        <CampaignDetailsCard item={campaign} />
      </div>
    </div>
  );
}
