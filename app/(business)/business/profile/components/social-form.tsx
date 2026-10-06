"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { businessSocialSchema } from "@/lib/validations/business.schema";
import { updateBusinessSocialAction } from "@/server/actions/business.actions";

import { BUSINESS_PROFILE } from "../constant/profile.data";

const FIELDS = [
  {
    name: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    name: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourhandle",
  },
  {
    name: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@yourhandle",
  },
] as const;

export function SocialForm() {
  const { form, submit, result, pending } = useActionForm(
    businessSocialSchema,
    updateBusinessSocialAction,
    BUSINESS_PROFILE.social,
  );
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save links"
    >
      {FIELDS.map(({ name, label, placeholder }) => (
        <Field
          key={name}
          label={label}
          htmlFor={name}
          error={errors[name]?.message}
        >
          <Input
            id={name}
            type="url"
            inputMode="url"
            placeholder={placeholder}
            aria-invalid={!!errors[name]}
            {...register(name)}
          />
        </Field>
      ))}
    </ActionForm>
  );
}
