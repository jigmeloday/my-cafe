"use client";

import type { UseFormReturn } from "react-hook-form";

import { Field } from "@/components/shared/field";
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
          hint="Leave empty if it has no end date."
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Location"
          htmlFor="location"
          error={errors.location?.message}
        >
          <Input
            id="location"
            placeholder="e.g. Norzin Lam, Thimphu"
            aria-invalid={!!errors.location}
            {...register("location")}
          />
        </Field>
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
