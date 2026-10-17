"use client";

import { ActionForm } from "@/components/shared/action-form";
import { PhoneField } from "@/components/shared/phone-field";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { businessContactSchema } from "@/lib/validations/business.schema";
import { updateBusinessContactAction } from "@/server/actions/business.actions";

import type { BusinessProfileData } from "@/types/business-profile";

export function ContactForm({ data }: { data: BusinessProfileData["contact"] }) {
  const { form, submit, result, pending, dirty } = useActionForm(
    businessContactSchema,
    updateBusinessContactAction,
    data,
  );
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      dirty={dirty}
      submitLabel="Save contact details"
    >
      <PhoneField
        control={control}
        name="phone"
        label="Phone"
        hint="Bhutan mobiles start with 17 or 77."
        error={errors.phone?.message}
      />
      <Input label="Email" error={errors.email?.message} type="email" autoComplete="email" {...register("email")} />
      <Input label="Website" hint="Optional, e.g. https://example.bt" error={errors.website?.message} type="url" inputMode="url" {...register("website")} />
    </ActionForm>
  );
}
