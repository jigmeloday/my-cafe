"use client";

import { Send } from "lucide-react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { CoinCostSummary } from "@/components/business/coin-cost-summary";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { emailCost } from "@/lib/coins";
import { formatNumber } from "@/lib/formatters/number";
import type { EmailCampaignInput } from "@/lib/validations/email-campaign.schema";
import { sendTestEmailAction } from "@/server/actions/email-campaign.actions";

import {
  EMAIL_COPY,
  FOLLOWERS_TOTAL,
} from "../constant/email-campaign.constant";
import { estimateRecipients } from "../utils/email-campaign.utils";
import { EmailPreview } from "./email-preview";

export function CampaignAside({
  form,
}: {
  form: UseFormReturn<EmailCampaignInput>;
}) {
  const [
    subject,
    previewText,
    body,
    promotionId,
    locations,
    interests,
    birthdayThisMonth,
  ] = useWatch({
    control: form.control,
    name: [
      "subject",
      "previewText",
      "body",
      "promotionId",
      "locations",
      "interests",
      "birthdayThisMonth",
    ],
  });
  const test = useAction(sendTestEmailAction);
  const recipients = estimateRecipients({
    locations,
    interests,
    birthdayThisMonth,
  });

  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-xl border bg-surface p-4">
        <h3>{EMAIL_COPY.audienceTitle}</h3>
        <p className="mt-2 text-2xl font-semibold tabular-nums">
          {formatNumber(recipients)}
        </p>
        <p className="text-sm text-muted-foreground">
          {EMAIL_COPY.recipients} of {formatNumber(FOLLOWERS_TOTAL)} followers
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {EMAIL_COPY.consentNote}
        </p>
        <div className="mt-4 border-t pt-4">
          <CoinCostSummary cost={emailCost(recipients)} label="Cost to send" />
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <h3>{EMAIL_COPY.previewTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {EMAIL_COPY.previewHint}
          </p>
        </div>
        <EmailPreview
          subject={subject}
          previewText={previewText}
          body={body}
          promotionId={promotionId}
        />
      </div>
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={test.pending}
        onClick={() => test.run(form.getValues())}
      >
        <Send /> {EMAIL_COPY.sendTest}
      </Button>
      {test.result && !test.result.ok && (
        <FormMessage tone="error">{test.result.error}</FormMessage>
      )}
    </aside>
  );
}
