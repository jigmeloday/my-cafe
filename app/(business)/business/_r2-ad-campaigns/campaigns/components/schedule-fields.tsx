"use client";

import type { UseFormReturn } from "react-hook-form";

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
      <Input label="Starts" error={errors.startDate?.message} type="date" {...register("startDate")} />
      <Input label="Ends" hint="Empty = until the budget is spent." error={errors.endDate?.message} type="date" min={watch("startDate") || undefined} {...register("endDate")} />
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
