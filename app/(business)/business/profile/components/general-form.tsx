"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionForm } from "@/hooks/use-action-form";
import { businessGeneralSchema } from "@/lib/validations/business.schema";
import { updateBusinessGeneralAction } from "@/server/actions/business.actions";

import { DESCRIPTION_MAX } from "../constant/profile.constant";
import { BUSINESS_PROFILE } from "../constant/profile.data";
import { CategoryField } from "./category-field";

export function GeneralForm() {
  const { form, submit, result, pending } = useActionForm(
    businessGeneralSchema,
    updateBusinessGeneralAction,
    BUSINESS_PROFILE.general,
  );
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;
  const length = watch("description")?.length ?? 0;

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save changes"
    >
      <Field label="Business name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field
        label="Tagline"
        htmlFor="tagline"
        hint="One line that sums you up (optional)."
        error={errors.tagline?.message}
      >
        <Input
          id="tagline"
          maxLength={80}
          aria-invalid={!!errors.tagline}
          {...register("tagline")}
        />
      </Field>
      <Field
        label="Description"
        htmlFor="description"
        hint={`${length}/${DESCRIPTION_MAX}`}
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          rows={5}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>
      <CategoryField control={control} error={errors.categories?.message} />
    </ActionForm>
  );
}
