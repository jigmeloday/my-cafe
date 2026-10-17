"use client";

import { ActionForm } from "@/components/shared/action-form";
import { AddressFields } from "@/components/shared/address-fields";
import { useActionForm } from "@/hooks/use-action-form";
import { addressSchema } from "@/lib/validations/profile.schema";
import { updateBusinessLocationAction } from "@/server/actions/business.actions";

import type { BusinessProfileData } from "@/types/business-profile";

export function LocationForm({ data }: { data: BusinessProfileData["location"] }) {
  const { form, submit, result, pending, dirty } = useActionForm(
    addressSchema,
    updateBusinessLocationAction,
    data,
  );

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      dirty={dirty}
      submitLabel="Save location"
    >
      <AddressFields form={form} />
    </ActionForm>
  );
}
