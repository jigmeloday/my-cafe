"use client";

import { ActionForm } from "@/components/shared/action-form";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { resendVerificationSchema } from "@/lib/validations/auth.schema";
import { resendVerificationAction } from "@/server/actions/auth.actions";

import { PROBLEM_COPY } from "../constant/verified.constant";

export function ResendByEmail() {
  const { form, submit, result, pending, dirty } = useActionForm(resendVerificationSchema, resendVerificationAction, { email: "" });
  const { register, formState: { errors } } = form;

  return (
    <ActionForm onSubmit={submit} result={result} pending={pending} dirty={dirty} submitLabel={PROBLEM_COPY.submit} className="max-w-none">
      <Input label="Email" error={errors.email?.message} type="email" autoComplete="email" {...register("email")} />
    </ActionForm>
  );
}
