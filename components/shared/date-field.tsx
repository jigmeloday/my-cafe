"use client";

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

import { DatePicker } from "./date-picker";
import { Field } from "./field";

interface DateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  dropdowns?: boolean;
  clearable?: boolean;
}

/** A labelled date picker wired to a React Hook Form field. */
export function DateField<T extends FieldValues>({ control, name, label, hint, error, ...picker }: DateFieldProps<T>) {
  return (
    <Field label={label} htmlFor={name} hint={hint} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker id={name} value={field.value ?? ""} onChange={field.onChange} invalid={!!error} {...picker} />
        )}
      />
    </Field>
  );
}
