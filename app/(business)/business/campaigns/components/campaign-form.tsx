"use client";

import { SectionCard } from "@/components/business/section-card";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { useActionForm } from "@/hooks/use-action-form";
import {
  emailCampaignSchema,
  type EmailCampaignInput,
} from "@/lib/validations/email-campaign.schema";
import { saveEmailCampaignAction } from "@/server/actions/email-campaign.actions";

import { EMAIL_COPY } from "../constant/email-campaign.constant";
import { AudienceFields } from "./audience-fields";
import { CampaignAside } from "./campaign-aside";
import { MessageFields } from "./message-fields";
import { ScheduleFields } from "./schedule-fields";

export function CampaignForm({ initial }: { initial: EmailCampaignInput }) {
  const { form, submit, result, pending } = useActionForm(
    emailCampaignSchema,
    saveEmailCampaignAction,
    initial,
  );
  const setIntent = (intent: EmailCampaignInput["intent"]) => () =>
    form.setValue("intent", intent);
  const later = form.watch("sendMode") === "LATER";

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-6 lg:grid-cols-[1fr_20rem]"
    >
      <div className="min-w-0 space-y-4">
        {result && !result.ok && (
          <FormMessage tone="error">{result.error}</FormMessage>
        )}
        <SectionCard title="Message">
          <MessageFields form={form} />
        </SectionCard>
        <SectionCard
          title="Audience"
          description="Choose which of your followers should get this email."
        >
          <AudienceFields form={form} />
        </SectionCard>
        <SectionCard title="Send">
          <ScheduleFields form={form} />
        </SectionCard>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            variant="secondary"
            disabled={pending}
            onClick={setIntent("DRAFT")}
          >
            {EMAIL_COPY.saveDraft}
          </Button>
          <Button type="submit" disabled={pending} onClick={setIntent("SEND")}>
            {pending
              ? "Saving…"
              : later
                ? EMAIL_COPY.schedule
                : EMAIL_COPY.sendNow}
          </Button>
        </div>
      </div>
      <CampaignAside form={form} />
    </form>
  );
}
