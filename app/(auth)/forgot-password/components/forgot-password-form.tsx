"use client";

import { FormMessage } from "@/components/shared/form-message";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { forgotPasswordSchema } from "@/lib/validations/auth.schema";
import { forgotPasswordAction } from "@/server/actions/auth.actions";

import { FORGOT_COPY } from "../constant/forgot-password.constant";

export function ForgotPasswordForm() {
  const { form, submit, result, pending } = useActionForm(
    forgotPasswordSchema,
    forgotPasswordAction,
    { email: "" },
  );
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {result && !result.ok && (
        <FormMessage tone="error">{result.error}</FormMessage>
      )}
      {result?.ok && (
        <FormMessage tone="success">
          {result.message ?? FORGOT_COPY.success}
        </FormMessage>
      )}
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : FORGOT_COPY.submit}
      </Button>
    </form>
  );
}
