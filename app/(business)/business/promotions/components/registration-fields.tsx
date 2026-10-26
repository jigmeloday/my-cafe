"use client";

import { Controller, useWatch, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { REGISTRATION_MODE_OPTIONS } from "../constant/promotion.constant";

/** For events: how people reserve a place, if they need to. Here on Nook, or on a website the organiser already uses. */
export function RegistrationFields({ form }: { form: UseFormReturn<PromotionInput> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const mode = useWatch({ control, name: "registrationMode" });

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name="registrationMode"
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange} aria-label="How people reserve" className="gap-3">
            {REGISTRATION_MODE_OPTIONS.map(({ value, title, text }) => (
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
      {mode === "EXTERNAL" && (
        <Input
          label="Link where people reserve"
          hint="Your own booking or ticket page. It opens in a new tab."
          error={errors.registrationUrl?.message}
          type="url"
          inputMode="url"
          placeholder="https://"
          {...register("registrationUrl")}
        />
      )}
      {mode !== "NONE" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Button wording" hint='For example "Reserve my seat", "Book on our site" or "Buy tickets"' error={errors.registrationLabel?.message} maxLength={30} {...register("registrationLabel")} />
          {mode === "NOOK" && (
            <Input label="Number of seats (optional)" hint="Leave empty for no limit." error={errors.capacity?.message} inputMode="numeric" placeholder="e.g. 50" {...register("capacity")} />
          )}
        </div>
      )}
    </div>
  );
}
