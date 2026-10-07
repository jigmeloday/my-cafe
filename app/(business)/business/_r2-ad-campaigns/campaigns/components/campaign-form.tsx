"use client";

import { SectionCard } from "@/components/business/section-card";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { useActionForm } from "@/hooks/use-action-form";
import {
  campaignSchema,
  type CampaignInput,
} from "@/lib/validations/campaign.schema";
import { saveCampaignAction } from "@/server/actions/campaign.actions";

import { CAMPAIGNS_COPY } from "../constant/campaign.constant";
import { BasicsFields } from "./basics-fields";
import { BudgetFields } from "./budget-fields";
import { CampaignEstimate } from "./campaign-estimate";
import { ScheduleFields } from "./schedule-fields";
import { DestinationFields, TargetingFields } from "./targeting-fields";

export function CampaignForm({ initial }: { initial: CampaignInput }) {
  const { form, submit, result, pending } = useActionForm(
    campaignSchema,
    saveCampaignAction,
    initial,
  );
  const setIntent = (intent: CampaignInput["intent"]) => () =>
    form.setValue("intent", intent);

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-6 lg:grid-cols-[1fr_17rem]"
    >
      <div className="min-w-0 space-y-4">
        {result && !result.ok && (
          <FormMessage tone="error">{result.error}</FormMessage>
        )}
        <SectionCard title="Campaign">
          <BasicsFields form={form} />
        </SectionCard>
        <SectionCard
          title="Budget"
          description="You set the price per click and the most you're willing to spend."
        >
          <BudgetFields form={form} />
        </SectionCard>
        <SectionCard title="Schedule">
          <ScheduleFields form={form} />
        </SectionCard>
        <SectionCard
          title="Audience"
          description="Who should see this promotion."
        >
          <TargetingFields form={form} />
        </SectionCard>
        <SectionCard title="Destination">
          <DestinationFields form={form} />
        </SectionCard>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            variant="secondary"
            disabled={pending}
            onClick={setIntent("DRAFT")}
          >
            {CAMPAIGNS_COPY.saveDraft}
          </Button>
          <Button
            type="submit"
            disabled={pending}
            onClick={setIntent("LAUNCH")}
          >
            {pending ? "Saving…" : CAMPAIGNS_COPY.launch}
          </Button>
        </div>
      </div>
      <CampaignEstimate control={form.control} />
    </form>
  );
}
