import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CampaignForm } from "../../components/campaign-form";
import { FormPageHeader } from "../../components/form-page-header";
import { EMAIL_COPY } from "../../constant/email-campaign.constant";
import { findEmailCampaign } from "../../constant/email-campaigns.data";
import { canEdit, toFormValues } from "../../utils/email-campaign.utils";

export const metadata: Metadata = { title: "Edit campaign — kuzu business" };

export default async function EditCampaignPage({
  params,
}: PageProps<"/business/campaigns/[id]/edit">) {
  const { id } = await params;
  const campaign = findEmailCampaign(id);
  if (!campaign) notFound();
  if (!canEdit(campaign.status)) redirect(`/business/campaigns/${id}`);

  return (
    <div className="space-y-6">
      <FormPageHeader
        title={EMAIL_COPY.editTitle}
        subtitle={EMAIL_COPY.editSubtitle}
        backHref={`/business/campaigns/${id}`}
        backLabel={campaign.name}
      />
      <CampaignForm initial={toFormValues(campaign)} />
    </div>
  );
}
