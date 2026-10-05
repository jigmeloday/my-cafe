"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Field } from "@/components/shared/field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { personalInfoSchema } from "@/lib/validations/profile.schema";
import { updatePersonalInfoAction } from "@/server/actions/account.actions";

import { GENDER_OPTIONS } from "../constant/profile-options.constant";
import type { ProfileUser } from "../model/profile.type";

export function PersonalInfoForm({ user }: { user: ProfileUser }) {
  const { form, submit, result, pending } = useActionForm(
    personalInfoSchema,
    updatePersonalInfoAction,
    user.personal,
  );
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const today = new Date().toISOString().split("T")[0];

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save changes"
    >
      <Field label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Birthday"
          htmlFor="birthday"
          error={errors.birthday?.message}
        >
          <Input
            id="birthday"
            type="date"
            max={today}
            autoComplete="bday"
            aria-invalid={!!errors.birthday}
            {...register("birthday")}
          />
        </Field>
        <SelectField
          control={control}
          name="gender"
          label="Gender"
          options={GENDER_OPTIONS}
          placeholder="Optional"
          error={errors.gender?.message}
        />
      </div>
    </ActionForm>
  );
}
