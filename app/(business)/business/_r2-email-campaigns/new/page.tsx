import type { Metadata } from "next";

import { CampaignForm } from "../components/campaign-form";
import { FormPageHeader } from "../components/form-page-header";
import {
  EMAIL_COPY,
  NEW_EMAIL_CAMPAIGN,
} from "../constant/email-campaign.constant";

export const metadata: Metadata = { title: "New campaign — kuzu business" };

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <FormPageHeader
        title={EMAIL_COPY.newTitle}
        subtitle={EMAIL_COPY.newSubtitle}
      />
      <CampaignForm initial={NEW_EMAIL_CAMPAIGN} />
    </div>
  );
}
