"use client";

import type { UseFormReturn } from "react-hook-form";

import { Field } from "@/components/shared/field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import type { CampaignInput } from "@/lib/validations/campaign.schema";

import { SCHEDULE_OPTIONS } from "../constant/campaign.constant";

export function ScheduleFields({
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
    <div className="grid gap-4 sm:grid-cols-3">
      <Field
        label="Starts"
        htmlFor="startDate"
        error={errors.startDate?.message}
      >
        <Input
          id="startDate"
          type="date"
          aria-invalid={!!errors.startDate}
          {...register("startDate")}
        />
      </Field>
      <Field
        label="Ends"
        htmlFor="endDate"
        hint="Empty = until the budget is spent."
        error={errors.endDate?.message}
      >
        <Input
          id="endDate"
          type="date"
          min={watch("startDate") || undefined}
          aria-invalid={!!errors.endDate}
          {...register("endDate")}
        />
      </Field>
      <SelectField
        control={control}
        name="schedule"
        label="Show on"
        options={SCHEDULE_OPTIONS}
        error={errors.schedule?.message}
      />
    </div>
  );
}
