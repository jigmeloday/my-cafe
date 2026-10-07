"use client";

import type { UseFormReturn } from "react-hook-form";

import { Field } from "@/components/shared/field";
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
      <Field label="Title" htmlFor="title" error={errors.title?.message}>
        <Input
          id="title"
          maxLength={80}
          aria-invalid={!!errors.title}
          {...register("title")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          control={control}
          name="type"
          label="Type"
          options={TYPE_OPTIONS}
          error={errors.type?.message}
        />
        <Field
          label="Discount or highlight"
          htmlFor="discount"
          hint="e.g. 20% off, Buy 1 get 1, Free entry"
          error={errors.discount?.message}
        >
          <Input
            id="discount"
            maxLength={40}
            aria-invalid={!!errors.discount}
            {...register("discount")}
          />
        </Field>
      </div>
      <Field
        label="Description"
        htmlFor="description"
        hint={`${length}/${DESCRIPTION_MAX}`}
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          rows={5}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>
    </>
  );
}
