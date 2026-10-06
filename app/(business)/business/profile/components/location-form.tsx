"use client";

import { ActionForm } from "@/components/shared/action-form";
import { AddressFields } from "@/components/shared/address-fields";
import { useActionForm } from "@/hooks/use-action-form";
import { addressSchema } from "@/lib/validations/profile.schema";
import { updateBusinessLocationAction } from "@/server/actions/business.actions";

import { BUSINESS_PROFILE } from "../constant/profile.data";

export function LocationForm() {
  const { form, submit, result, pending } = useActionForm(
    addressSchema,
    updateBusinessLocationAction,
    BUSINESS_PROFILE.location,
  );

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save location"
    >
      <AddressFields form={form} />
    </ActionForm>
  );
}
