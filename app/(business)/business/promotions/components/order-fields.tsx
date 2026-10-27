"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { PromotionInput } from "@/lib/validations/promotion.schema";

import { ORDER_COPY as COPY, ORDER_MODE_OPTIONS } from "../constant/promotion.constant";
import { ModeRadioGroup } from "./mode-radio-group";

/** For deals and sales: an optional price, and how people order (here on Nook, on WhatsApp or on the seller's website). */
export function OrderFields({ form }: { form: UseFormReturn<PromotionInput> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const mode = useWatch({ control, name: "orderMode" });

  return (
    <div className="space-y-4">
      <Input label={COPY.priceLabel} hint={COPY.priceHint} error={errors.price?.message} inputMode="decimal" placeholder="e.g. 250" className="sm:max-w-xs" {...register("price")} />
      <ModeRadioGroup control={control} name="orderMode" label="How people order" options={ORDER_MODE_OPTIONS} />
      {mode === "EXTERNAL" && (
        <Input label={COPY.urlLabel} hint={COPY.urlHint} error={errors.orderUrl?.message} type="url" inputMode="url" placeholder="https://" {...register("orderUrl")} />
      )}
      {mode !== "NONE" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={COPY.labelLabel} hint={COPY.labelHint} error={errors.orderLabel?.message} maxLength={30} {...register("orderLabel")} />
          {mode === "WHATSAPP" && <p className="self-end pb-2 text-sm text-muted-foreground">{COPY.whatsappHint}</p>}
        </div>
      )}
    </div>
  );
}
