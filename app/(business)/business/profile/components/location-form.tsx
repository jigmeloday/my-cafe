"use client";

import type { UseFormReturn } from "react-hook-form";

import { ActionForm } from "@/components/shared/action-form";
import { AddressFields } from "@/components/shared/address-fields";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { businessLocationSchema } from "@/lib/validations/business.schema";
import type { AddressInput } from "@/lib/validations/profile.schema";
import { updateBusinessLocationAction } from "@/server/actions/business.actions";

import type { BusinessProfileData } from "@/types/business-profile";

export function LocationForm({ data }: { data: BusinessProfileData["location"] }) {
  const { form, submit, result, pending, dirty } = useActionForm(
    businessLocationSchema,
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
      {/* The address fields only touch their own five fields; the form also carries the map link. */}
      <AddressFields form={form as unknown as UseFormReturn<AddressInput>} />
      <Input
        label="Google Maps link"
        hint="Open your shop in Google Maps, tap Share, then Copy link. Customers get directions from it (optional)."
        error={form.formState.errors.mapUrl?.message}
        type="url"
        inputMode="url"
        placeholder="https://maps.app.goo.gl/..."
        {...form.register("mapUrl")}
      />
    </ActionForm>
  );
}
