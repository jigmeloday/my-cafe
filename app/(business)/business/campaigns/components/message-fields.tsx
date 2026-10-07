"use client";

import type { UseFormReturn } from "react-hook-form";

import { Field } from "@/components/shared/field";
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
      <Field
        label="Campaign name"
        htmlFor="name"
        hint="Only you see this."
        error={errors.name?.message}
      >
        <Input
          id="name"
          maxLength={60}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>
      <Field
        label="Subject"
        htmlFor="subject"
        hint={`${watch("subject")?.length ?? 0}/80`}
        error={errors.subject?.message}
      >
        <Input
          id="subject"
          maxLength={80}
          aria-invalid={!!errors.subject}
          {...register("subject")}
        />
      </Field>
      <Field
        label="Preview text"
        htmlFor="previewText"
        hint="The short line shown after the subject (optional)."
        error={errors.previewText?.message}
      >
        <Input
          id="previewText"
          maxLength={120}
          aria-invalid={!!errors.previewText}
          {...register("previewText")}
        />
      </Field>
      <Field
        label="Message"
        htmlFor="body"
        hint={`${watch("body")?.length ?? 0}/${BODY_MAX}. Leave a blank line between paragraphs.`}
        error={errors.body?.message}
      >
        <Textarea
          id="body"
          rows={8}
          aria-invalid={!!errors.body}
          {...register("body")}
        />
      </Field>
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
