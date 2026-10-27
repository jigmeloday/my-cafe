"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { REGISTRATION_MODE_OPTIONS } from "../constant/promotion.constant";
import { ModeRadioGroup } from "./mode-radio-group";

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
      <ModeRadioGroup control={control} name="registrationMode" label="How people reserve" options={REGISTRATION_MODE_OPTIONS} />
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
