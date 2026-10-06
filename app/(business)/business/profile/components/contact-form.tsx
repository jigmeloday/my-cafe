"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Field } from "@/components/shared/field";
import { PhoneField } from "@/components/shared/phone-field";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { businessContactSchema } from "@/lib/validations/business.schema";
import { updateBusinessContactAction } from "@/server/actions/business.actions";

import { BUSINESS_PROFILE } from "../constant/profile.data";

export function ContactForm() {
  const { form, submit, result, pending } = useActionForm(
    businessContactSchema,
    updateBusinessContactAction,
    BUSINESS_PROFILE.contact,
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
      submitLabel="Save contact details"
    >
      <PhoneField
        control={control}
        name="phone"
        label="Phone"
        hint="Bhutan mobiles start with 17 or 77."
        error={errors.phone?.message}
      />
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      <Field
        label="Website"
        htmlFor="website"
        hint="Optional, e.g. https://example.bt"
        error={errors.website?.message}
      >
        <Input
          id="website"
          type="url"
          inputMode="url"
          aria-invalid={!!errors.website}
          {...register("website")}
        />
      </Field>
    </ActionForm>
  );
}
