"use client";

import { ActionForm } from "@/components/shared/action-form";
import { AddressFields } from "@/components/shared/address-fields";
import { useActionForm } from "@/hooks/use-action-form";
import { addressSchema } from "@/lib/validations/profile.schema";
import { updateAddressAction } from "@/server/actions/account.actions";

import type { ProfileUser } from "../model/profile.type";

export function AddressForm({ user }: { user: ProfileUser }) {
  const { form, submit, result, pending } = useActionForm(
    addressSchema,
    updateAddressAction,
    user.address,
  );

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save address"
    >
      <AddressFields form={form} />
    </ActionForm>
  );
}
