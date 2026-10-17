"use client";

import type { UseFormReturn } from "react-hook-form";

import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EmailCampaignInput } from "@/lib/validations/email-campaign.schema";

import { BODY_MAX } from "../constant/email-campaign.constant";
import { publishedPromotionOptions } from "../utils/email-campaign.utils";

const NONE = { value: "none", label: "No promotion" };

export function MessageFields({
  form,
}: {
  form: UseFormReturn<EmailCampaignInput>;
}) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;
  const options = [NONE, ...publishedPromotionOptions()];

  return (
    <>
      <Input label="Campaign name" hint="Only you see this." error={errors.name?.message} maxLength={60} {...register("name")} />
      <Input label="Subject" hint={`${watch("subject")?.length ?? 0}/80`} error={errors.subject?.message} maxLength={80} {...register("subject")} />
      <Input label="Preview text" hint="The short line shown after the subject (optional)." error={errors.previewText?.message} maxLength={120} {...register("previewText")} />
      <Textarea label="Message" hint={`${watch("body")?.length ?? 0}/${BODY_MAX}. Leave a blank line between paragraphs.`} error={errors.body?.message} rows={8} {...register("body")} />
      <SelectField
        control={control}
        name="promotionId"
        label="Feature a promotion"
        options={options}
        placeholder="Optional"
        error={errors.promotionId?.message}
      />
    </>
  );
}
