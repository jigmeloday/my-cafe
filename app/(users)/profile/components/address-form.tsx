"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Field } from "@/components/shared/field";
import { SelectField } from "@/components/shared/select-field";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { addressSchema } from "@/lib/validations/profile.schema";
import { updateAddressAction } from "@/server/actions/account.actions";

import { DZONGKHAG_OPTIONS } from "../constant/profile-options.constant";
import type { ProfileUser } from "../model/profile.type";

export function AddressForm({ user }: { user: ProfileUser }) {
  const { form, submit, result, pending } = useActionForm(
    addressSchema,
    updateAddressAction,
    user.address,
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
      submitLabel="Save address"
    >
      <Field
        label="Address line 1"
        htmlFor="line1"
        error={errors.line1?.message}
      >
        <Input
          id="line1"
          autoComplete="address-line1"
          aria-invalid={!!errors.line1}
          {...register("line1")}
        />
      </Field>
      <Field
        label="Address line 2"
        htmlFor="line2"
        hint="Building, floor or landmark (optional)."
        error={errors.line2?.message}
      >
        <Input
          id="line2"
          autoComplete="address-line2"
          aria-invalid={!!errors.line2}
          {...register("line2")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Town" htmlFor="town" error={errors.town?.message}>
          <Input
            id="town"
            autoComplete="address-level2"
            aria-invalid={!!errors.town}
            {...register("town")}
          />
        </Field>
        <SelectField
          control={control}
          name="dzongkhag"
          label="Dzongkhag"
          options={DZONGKHAG_OPTIONS}
          error={errors.dzongkhag?.message}
        />
      </div>
      <Field
        label="Postal code"
        htmlFor="postalCode"
        error={errors.postalCode?.message}
        className="sm:max-w-[calc(50%-0.5rem)]"
      >
        <Input
          id="postalCode"
          inputMode="numeric"
          autoComplete="postal-code"
          aria-invalid={!!errors.postalCode}
          {...register("postalCode")}
        />
      </Field>
    </ActionForm>
  );
}
