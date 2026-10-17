"use client";

import type { UseFormReturn } from "react-hook-form";

import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { DESCRIPTION_MAX, TYPE_OPTIONS } from "../constant/promotion.constant";

export function DetailsFields({
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
  const length = watch("description")?.length ?? 0;

  return (
    <>
      <Input label="Title" error={errors.title?.message} maxLength={80} {...register("title")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          control={control}
          name="type"
          label="Type"
          options={TYPE_OPTIONS}
          error={errors.type?.message}
        />
        <Input label="Discount or highlight" hint="e.g. 20% off, Buy 1 get 1, Free entry" error={errors.discount?.message} maxLength={40} {...register("discount")} />
      </div>
      <Textarea label="Description" hint={`${length}/${DESCRIPTION_MAX}`} error={errors.description?.message} rows={5} {...register("description")} />
    </>
  );
}
