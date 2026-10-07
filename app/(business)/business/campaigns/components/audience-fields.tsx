"use client";

import type { UseFormReturn } from "react-hook-form";

import { ChipMultiField } from "@/components/shared/chip-multi-field";
import { SwitchField } from "@/components/shared/switch-field";
import type { EmailCampaignInput } from "@/lib/validations/email-campaign.schema";

import {
  INTEREST_OPTIONS,
  LOCATION_OPTIONS,
} from "../constant/email-campaign.constant";

export function AudienceFields({
  form,
}: {
  form: UseFormReturn<EmailCampaignInput>;
}) {
  const { control } = form;

  return (
    <>
      <ChipMultiField
        control={control}
        name="locations"
        label="Where they live"
        options={LOCATION_OPTIONS}
        hint="Leave empty to include all your followers."
      />
      <ChipMultiField
        control={control}
        name="interests"
        label="Interested in"
        options={INTEREST_OPTIONS}
        hint="Leave empty to include everyone."
      />
      <div className="border-y">
        <SwitchField
          control={control}
          name="birthdayThisMonth"
          label="Birthday this month"
          description="Only followers with a birthday this month, e.g. for a birthday treat."
        />
      </div>
    </>
  );
}
