"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Chip } from "./chip";
import { Field } from "./field";

interface ChipMultiFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: readonly string[];
  hint?: string;
  error?: string;
}

export function ChipMultiField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  hint,
  error,
}: ChipMultiFieldProps<T>) {
  return (
    <Field label={label} htmlFor={name} hint={hint} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value: string[] = field.value ?? [];
          return (
            <div id={name} className="flex flex-wrap gap-2">
              {options.map((option) => {
                const selected = value.includes(option);
                return (
                  <Chip
                    key={option}
                    active={selected}
                    onClick={() =>
                      field.onChange(
                        selected
                          ? value.filter((v) => v !== option)
                          : [...value, option],
                      )
                    }
                  >
                    {option}
                  </Chip>
                );
              })}
            </div>
          );
        }}
      />
    </Field>
  );
}
