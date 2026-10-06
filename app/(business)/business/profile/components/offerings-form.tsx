"use client";

import { ActionForm } from "@/components/shared/action-form";
import { TagField } from "@/components/shared/tag-field";
import { useActionForm } from "@/hooks/use-action-form";
import { businessOfferingsSchema } from "@/lib/validations/business.schema";
import { updateBusinessOfferingsAction } from "@/server/actions/business.actions";

import { BUSINESS_PROFILE } from "../constant/profile.data";

export function OfferingsForm() {
  const { form, submit, result, pending } = useActionForm(
    businessOfferingsSchema,
    updateBusinessOfferingsAction,
    BUSINESS_PROFILE.offerings,
  );
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <ActionForm
      onSubmit={submit}
      result={result}
      pending={pending}
      submitLabel="Save"
    >
      <TagField
        control={control}
        name="services"
        label="Services"
        hint="e.g. Dine-in, Catering, Delivery"
        placeholder="Add a service"
        error={errors.services?.message}
      />
      <TagField
        control={control}
        name="products"
        label="Products"
        hint="e.g. Hand-woven kira, Momos"
        placeholder="Add a product"
        error={errors.products?.message}
      />
    </ActionForm>
  );
}
