"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Field } from "@/components/shared/field";
import { PhoneField } from "@/components/shared/phone-field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { contactSchema } from "@/lib/validations/profile.schema";
import { updateContactAction } from "@/server/actions/account.actions";

import { CONTACT_OPTIONS } from "../constant/profile-options.constant";
import type { ProfileUser } from "../model/profile.type";

export function ContactForm({ user }: { user: ProfileUser }) {
  const { form, submit, result, pending } = useActionForm(
    contactSchema,
    updateContactAction,
    user.contact,
  );
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save changes"
    >
      <Field
        label="Email"
        htmlFor="email"
        hint="Used to sign in. Can't be changed here."
      >
        <Input id="email" value={user.email} disabled readOnly />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <PhoneField
          control={control}
          name="phone"
          label="Phone"
          hint="Bhutan mobiles start with 17 or 77."
          error={errors.phone?.message}
        />
        <SelectField
          control={control}
          name="preferredContact"
          label="Preferred contact"
          options={CONTACT_OPTIONS}
          error={errors.preferredContact?.message}
        />
      </div>
    </ActionForm>
  );
}
