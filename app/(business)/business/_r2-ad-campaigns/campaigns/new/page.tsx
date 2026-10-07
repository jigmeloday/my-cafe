import type { Metadata } from "next";

import { FormPageHeader } from "../components/form-page-header";
import { CampaignForm } from "../components/campaign-form";
import { CAMPAIGNS_COPY, NEW_CAMPAIGN } from "../constant/campaign.constant";
import { publishedPromotionOptions } from "../utils/campaign.utils";

export const metadata: Metadata = { title: "New campaign — kuzu business" };

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { promotion } = await searchParams;
  const requested = typeof promotion === "string" ? promotion : "";
  const promotionId = publishedPromotionOptions().some(
    (o) => o.value === requested,
  )
    ? requested
    : "";

  return (
    <div className="space-y-6">
      <FormPageHeader
        title={CAMPAIGNS_COPY.newTitle}
        subtitle={CAMPAIGNS_COPY.newSubtitle}
      />
      <CampaignForm initial={{ ...NEW_CAMPAIGN, promotionId }} />
    </div>
  );
}
