"use client";

import { Controller, type Control } from "react-hook-form";

import { Chip } from "@/components/shared/chip";
import { Field } from "@/components/shared/field";
import type { BusinessGeneralInput } from "@/lib/validations/business.schema";

import { CATEGORY_OPTIONS, MAX_CATEGORIES } from "../constant/profile.constant";

interface CategoryFieldProps {
  control: Control<BusinessGeneralInput>;
  error?: string;
}

export function CategoryField({ control, error }: CategoryFieldProps) {
  return (
    <Field
      label="Categories"
      htmlFor="categories"
      hint={`Pick up to ${MAX_CATEGORIES}.`}
      error={error}
    >
      <Controller
        control={control}
        name="categories"
        render={({ field }) => (
          <div id="categories" className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((name) => {
              const selected = field.value.includes(name);
              const toggle = () =>
                field.onChange(
                  selected
                    ? field.value.filter((v) => v !== name)
                    : [...field.value, name],
                );
              return (
                <Chip key={name} active={selected} onClick={toggle}>
                  {name}
                </Chip>
              );
            })}
          </div>
        )}
      />
    </Field>
  );
}
