"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Switch } from "@/components/ui/switch";

interface SwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: SwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center justify-between gap-6 py-4">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">{label}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Switch
            checked={!!field.value}
            onCheckedChange={field.onChange}
            aria-label={label}
          />
        </div>
      )}
    />
  );
}
