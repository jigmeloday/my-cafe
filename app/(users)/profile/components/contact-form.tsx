"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Field } from "@/components/shared/field";
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
    register,
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
        <Field
          label="Phone"
          htmlFor="phone"
          hint="e.g. +975 17 000 000"
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>
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
