"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionForm } from "@/hooks/use-action-form";
import { businessGeneralSchema } from "@/lib/validations/business.schema";
import { updateBusinessGeneralAction } from "@/server/actions/business.actions";

import {
  DESCRIPTION_MAX,
} from "../constant/profile.constant";
import type { BusinessProfileData } from "@/types/business-profile";

export function GeneralForm({ data }: { data: BusinessProfileData["general"] }) {
  const { form, submit, result, pending, dirty } = useActionForm(
    businessGeneralSchema,
    updateBusinessGeneralAction,
    data,
  );
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const length = watch("description")?.length ?? 0;

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      dirty={dirty}
      submitLabel="Save changes"
    >
      <Input label="Business name" error={errors.name?.message} {...register("name")} />
      <Input label="Tagline" hint="One line that sums you up (optional)." error={errors.tagline?.message} maxLength={80} {...register("tagline")} />
      <Textarea label="Description" hint={`${length}/${DESCRIPTION_MAX}`} error={errors.description?.message} rows={5} {...register("description")} />
    </ActionForm>
  );
}
