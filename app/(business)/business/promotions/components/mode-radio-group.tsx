"use client";

import { Controller, type Control } from "react-hook-form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

interface ModeRadioGroupProps {
  control: Control<PromotionInput>;
  name: "registrationMode" | "orderMode";
  label: string;
  options: readonly { value: string; title: string; text: string }[];
}

/** A list of choices as cards: the owner picks one way of doing something (reserving, ordering). */
export function ModeRadioGroup({ control, name, label, options }: ModeRadioGroupProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <RadioGroup value={field.value} onValueChange={field.onChange} aria-label={label} className="gap-3">
          {options.map(({ value, title, text }) => (
            <label key={value} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 has-data-checked:border-primary has-data-checked:bg-maroon-soft/40">
              <RadioGroupItem value={value} className="mt-0.5" />
              <span className="space-y-0.5">
                <span className="block font-semibold">{title}</span>
                <span className="block text-sm text-muted-foreground">{text}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
      )}
    />
  );
}
