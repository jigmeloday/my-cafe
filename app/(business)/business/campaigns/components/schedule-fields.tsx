"use client";

import type { UseFormReturn } from "react-hook-form";

import { DateField } from "@/components/shared/date-field";
import { Field } from "@/components/shared/field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { todayIso } from "@/lib/formatters/date";
import type { EmailCampaignInput } from "@/lib/validations/email-campaign.schema";

import { SEND_MODE_OPTIONS } from "../constant/email-campaign.constant";

export function ScheduleFields({
  form,
}: {
  form: UseFormReturn<EmailCampaignInput>;
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SelectField
        control={control}
        name="sendMode"
        label="When"
        options={SEND_MODE_OPTIONS}
        error={errors.sendMode?.message}
      />
      {watch("sendMode") === "LATER" && (
        <>
          <DateField
            control={control}
            name="sendDate"
            label="Date"
            min={todayIso()}
            error={errors.sendDate?.message}
          />
          <Field
            label="Time"
            htmlFor="sendTime"
            error={errors.sendTime?.message}
          >
            <Input
              id="sendTime"
              type="time"
              aria-invalid={!!errors.sendTime}
              {...register("sendTime")}
            />
          </Field>
        </>
      )}
    </div>
  );
}
