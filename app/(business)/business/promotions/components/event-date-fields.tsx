"use client";

import { useEffect } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { DateField } from "@/components/shared/date-field";
import { Input } from "@/components/ui/input";
import { todayIso } from "@/lib/formatters/date";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { EVENT_DATES_COPY as COPY } from "../constant/promotion.constant";

/** For events: the days and times the event itself happens, apart from how long it is listed on Nook. */
export function EventDateFields({ form }: { form: UseFormReturn<PromotionInput> }) {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const [eventStart, eventEnd] = useWatch({ control, name: ["eventStartDate", "eventEndDate"] });

  // Most events are listed until they happen, so fill the listing days in once the event day is chosen (and the owner hasn't).
  useEffect(() => {
    const lastDay = eventEnd || eventStart;
    if (!lastDay) return;
    if (!getValues("endDate")) setValue("endDate", lastDay, { shouldDirty: true });
    if (!getValues("startDate")) setValue("startDate", todayIso(), { shouldDirty: true });
  }, [eventStart, eventEnd, getValues, setValue]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <DateField control={control} name="eventStartDate" label={COPY.start} min={todayIso()} error={errors.eventStartDate?.message} />
        <DateField control={control} name="eventEndDate" label={COPY.end} hint={COPY.endHint} min={eventStart || todayIso()} clearable error={errors.eventEndDate?.message} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={COPY.startTime} type="time" error={errors.eventStartTime?.message} {...register("eventStartTime")} />
        <Input label={COPY.endTime} type="time" error={errors.eventEndTime?.message} {...register("eventEndTime")} />
      </div>
    </div>
  );
}
