"use client";

import { ActionForm } from "@/components/shared/action-form";
import { DateField } from "@/components/shared/date-field";
import { Field } from "@/components/shared/field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { todayIso } from "@/lib/formatters/date";
import { useActionForm } from "@/hooks/use-action-form";
import { personalInfoSchema } from "@/lib/validations/profile.schema";
import { updatePersonalInfoAction } from "@/server/actions/account.actions";

import { GENDER_OPTIONS } from "../constant/profile-options.constant";
import type { ProfileUser } from "../model/profile.type";

export function PersonalInfoForm({ user }: { user: ProfileUser }) {
  const { form, submit, result, pending, dirty } = useActionForm(
    personalInfoSchema,
    updatePersonalInfoAction,
    user.personal,
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
        <DateField
          control={control}
          name="birthday"
          label="Birthday"
          placeholder="Pick your birthday"
          max={todayIso()}
          dropdowns
          clearable
          error={errors.birthday?.message}
        />
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
