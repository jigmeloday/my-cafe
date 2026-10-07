"use client";

import type { UseFormReturn } from "react-hook-form";

import { ChipMultiField } from "@/components/shared/chip-multi-field";
import { Field } from "@/components/shared/field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import type { CampaignInput } from "@/lib/validations/campaign.schema";

import {
  DESTINATION_OPTIONS,
  INTEREST_OPTIONS,
  LOCATION_OPTIONS,
} from "../constant/campaign.constant";

export function TargetingFields({
  form,
}: {
  form: UseFormReturn<CampaignInput>;
}) {
  const { control } = form;

  return (
    <>
      <ChipMultiField
        control={control}
        name="locations"
        label="Where"
        options={LOCATION_OPTIONS}
        hint="Leave empty to show everywhere."
      />
      <ChipMultiField
        control={control}
        name="interests"
        label="Interested in"
        options={INTEREST_OPTIONS}
        hint="Leave empty to show to everyone."
      />
    </>
  );
}

export function DestinationFields({
  form,
}: {
  form: UseFormReturn<CampaignInput>;
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField
        control={control}
        name="destination"
        label="Where clicks go"
        options={DESTINATION_OPTIONS}
        error={errors.destination?.message}
      />
      {watch("destination") === "CUSTOM" && (
        <Field
          label="Link"
          htmlFor="destinationUrl"
          error={errors.destinationUrl?.message}
        >
          <Input
            id="destinationUrl"
            type="url"
            inputMode="url"
            placeholder="https://"
            aria-invalid={!!errors.destinationUrl}
            {...register("destinationUrl")}
          />
        </Field>
      )}
    </div>
  );
}
