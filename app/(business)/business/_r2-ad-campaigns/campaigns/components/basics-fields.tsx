"use client";

import type { UseFormReturn } from "react-hook-form";

import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import type { CampaignInput } from "@/lib/validations/campaign.schema";

import { NO_PUBLISHED_PROMOTIONS } from "../constant/campaign.constant";
import { publishedPromotionOptions } from "../utils/campaign.utils";

export function BasicsFields({ form }: { form: UseFormReturn<CampaignInput> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const options = publishedPromotionOptions();

  return (
    <>
      <Input label="Campaign name" hint="Only you see this. e.g. Tshechu weekend push" error={errors.name?.message} maxLength={60} {...register("name")} />
      <SelectField
        control={control}
        name="promotionId"
        label="Promotion to boost"
        options={options}
        placeholder={
          options.length ? "Choose a promotion" : NO_PUBLISHED_PROMOTIONS
        }
        error={errors.promotionId?.message}
      />
    </>
  );
}
