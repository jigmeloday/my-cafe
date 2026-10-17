"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { businessSocialSchema } from "@/lib/validations/business.schema";
import { updateBusinessSocialAction } from "@/server/actions/business.actions";

import type { BusinessProfileData } from "@/types/business-profile";

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

export function SocialForm({ data }: { data: BusinessProfileData["social"] }) {
  const { form, submit, result, pending, dirty } = useActionForm(
    businessSocialSchema,
    updateBusinessSocialAction,
    data,
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
      dirty={dirty}
      submitLabel="Save links"
    >
      {FIELDS.map(({ name, label, placeholder }) => (
        <Input key={name} label={label} error={errors[name]?.message} type="url" inputMode="url" placeholder={placeholder} {...register(name)} />
      ))}
    </ActionForm>
  );
}
