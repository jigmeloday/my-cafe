"use client";

import type { UseFormReturn } from "react-hook-form";

import { DZONGKHAGS } from "@/lib/constants";
import type { AddressInput } from "@/lib/validations/profile.schema";
import { Input } from "@/components/ui/input";

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
      <Input label="Address line 1" error={errors.line1?.message} autoComplete="address-line1" {...register("line1")} />
      <Input label="Address line 2" hint="Building, floor or landmark (optional)." error={errors.line2?.message} autoComplete="address-line2" {...register("line2")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Town" error={errors.town?.message} autoComplete="address-level2" {...register("town")} />
        <SelectField
          control={control}
          name="dzongkhag"
          label="Dzongkhag"
          options={DZONGKHAG_OPTIONS}
          error={errors.dzongkhag?.message}
        />
      </div>
      <div className="sm:max-w-[calc(50%-0.5rem)]">
        <Input
          label="Postal code"
          error={errors.postalCode?.message}
          inputMode="numeric"
          autoComplete="postal-code"
          {...register("postalCode")}
        />
      </div>
    </>
  );
}
