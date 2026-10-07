"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field } from "./field";
import { TagInput } from "./tag-input";

interface TagFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
  placeholder?: string;
  error?: string;
  max?: number;
}

export function TagField<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  placeholder,
  error,
  max,
}: TagFieldProps<T>) {
  return (
    <Field label={label} htmlFor={name} hint={hint} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TagInput
            id={name}
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder={placeholder}
            max={max}
          />
        )}
      />
    </Field>
  );
}
