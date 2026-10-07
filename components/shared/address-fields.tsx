"use client";

import type { UseFormReturn } from "react-hook-form";

import { DZONGKHAGS } from "@/lib/constants";
import type { AddressInput } from "@/lib/validations/profile.schema";
import { Input } from "@/components/ui/input";

import { Field } from "./field";
import { SelectField } from "./select-field";

const DZONGKHAG_OPTIONS = DZONGKHAGS.map((value) => ({ value, label: value }));

export function AddressFields({ form }: { form: UseFormReturn<AddressInput> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <Field
        label="Address line 1"
        htmlFor="line1"
        error={errors.line1?.message}
      >
        <Input
          id="line1"
          autoComplete="address-line1"
          aria-invalid={!!errors.line1}
          {...register("line1")}
        />
      </Field>
      <Field
        label="Address line 2"
        htmlFor="line2"
        hint="Building, floor or landmark (optional)."
        error={errors.line2?.message}
      >
        <Input
          id="line2"
          autoComplete="address-line2"
          aria-invalid={!!errors.line2}
          {...register("line2")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Town" htmlFor="town" error={errors.town?.message}>
          <Input
            id="town"
            autoComplete="address-level2"
            aria-invalid={!!errors.town}
            {...register("town")}
          />
        </Field>
        <SelectField
          control={control}
          name="dzongkhag"
          label="Dzongkhag"
          options={DZONGKHAG_OPTIONS}
          error={errors.dzongkhag?.message}
        />
      </div>
      <Field
        label="Postal code"
        htmlFor="postalCode"
        error={errors.postalCode?.message}
        className="sm:max-w-[calc(50%-0.5rem)]"
      >
        <Input
          id="postalCode"
          inputMode="numeric"
          autoComplete="postal-code"
          aria-invalid={!!errors.postalCode}
          {...register("postalCode")}
        />
      </Field>
    </>
  );
}
