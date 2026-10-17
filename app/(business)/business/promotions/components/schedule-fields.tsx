"use client";

import type { UseFormReturn } from "react-hook-form";

import { DateField } from "@/components/shared/date-field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { CATEGORY_OPTIONS } from "../constant/promotion.constant";

export function ScheduleFields({
  form,
}: {
  form: UseFormReturn<PromotionInput>;
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <DateField
          control={control}
          name="startDate"
          label="Starts"
          error={errors.startDate?.message}
        />
        <DateField
          control={control}
          name="endDate"
          label="Ends"
          hint="Leave empty if it has no end date."
          min={watch("startDate") || undefined}
          clearable
          error={errors.endDate?.message}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Location" error={errors.location?.message} placeholder="e.g. Norzin Lam, Thimphu" {...register("location")} />
        <SelectField
          control={control}
          name="category"
          label="Category"
          options={CATEGORY_OPTIONS}
          placeholder="Choose a category"
          error={errors.category?.message}
        />
      </div>
    </>
  );
}
