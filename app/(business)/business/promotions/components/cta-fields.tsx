"use client";

import type { UseFormReturn } from "react-hook-form";

import { Field } from "@/components/shared/field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { CTA_OPTIONS } from "../constant/promotion.constant";

export function CtaFields({ form }: { form: UseFormReturn<PromotionInput> }) {
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
        name="ctaType"
        label="Button"
        options={CTA_OPTIONS}
        error={errors.ctaType?.message}
      />
      {watch("ctaType") === "VISIT_WEBSITE" && (
        <Field
          label="Website link"
          htmlFor="ctaUrl"
          error={errors.ctaUrl?.message}
        >
          <Input
            id="ctaUrl"
            type="url"
            inputMode="url"
            placeholder="https://"
            aria-invalid={!!errors.ctaUrl}
            {...register("ctaUrl")}
          />
        </Field>
      )}
    </div>
  );
}
