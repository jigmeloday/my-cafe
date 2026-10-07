"use client";

import type { UseFormReturn } from "react-hook-form";

import { Field } from "@/components/shared/field";
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
      <Field
        label="Campaign name"
        htmlFor="name"
        hint="Only you see this. e.g. Tshechu weekend push"
        error={errors.name?.message}
      >
        <Input
          id="name"
          maxLength={60}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>
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
