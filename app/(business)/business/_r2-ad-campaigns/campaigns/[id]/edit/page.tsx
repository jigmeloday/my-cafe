import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CampaignForm } from "../../components/campaign-form";
import { FormPageHeader } from "../../components/form-page-header";
import { CAMPAIGNS_COPY } from "../../constant/campaign.constant";
import { findCampaign } from "../../constant/campaigns.data";
import { toFormValues } from "../../utils/campaign.utils";

export const metadata: Metadata = { title: "Edit campaign — kuzu business" };

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = findCampaign(id);
  if (!campaign) notFound();
  if (campaign.status === "COMPLETED" || campaign.status === "CANCELLED")
    redirect(`/business/campaigns/${id}`);

  return (
    <div className="space-y-6">
      <FormPageHeader
        title={CAMPAIGNS_COPY.editTitle}
        subtitle={CAMPAIGNS_COPY.editSubtitle}
        backHref={`/business/campaigns/${id}`}
        backLabel={campaign.name}
      />
      <CampaignForm initial={toFormValues(campaign)} />
    </div>
  );
}
