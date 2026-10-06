"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field } from "./field";

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select…",
  error,
}: SelectFieldProps<T>) {
  return (
    <Field label={label} htmlFor={name} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            items={options}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={name} className="w-full" aria-invalid={!!error}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label: text }) => (
                <SelectItem key={value} value={value}>
                  {text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  );
}
