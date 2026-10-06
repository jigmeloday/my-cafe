"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field } from "./field";
import { PhoneInput } from "./phone-input";

interface PhoneFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
  error?: string;
}

export function PhoneField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  error,
}: PhoneFieldProps<T>) {
  return (
    <Field label={label} htmlFor={name} hint={hint} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <PhoneInput
            id={name}
            value={field.value ?? ""}
            onChange={field.onChange}
            invalid={!!error}
          />
        )}
      />
    </Field>
  );
}
