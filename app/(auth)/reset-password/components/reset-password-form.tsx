"use client";

import { FormMessage } from "@/components/shared/form-message";
import { Field } from "@/components/shared/field";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { useActionForm } from "@/hooks/use-action-form";
import { resetPasswordSchema } from "@/lib/validations/auth.schema";
import { resetPasswordAction } from "@/server/actions/auth.actions";

import { RESET_COPY } from "../constant/reset-password.constant";

export function ResetPasswordForm() {
  const { form, submit, result, pending } = useActionForm(
    resetPasswordSchema,
    resetPasswordAction,
    { password: "", confirmPassword: "" },
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
      <Field
        label="New password"
        htmlFor="password"
        hint="At least 8 characters."
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </Field>
      <Field
        label="Confirm password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Updating…" : RESET_COPY.submit}
      </Button>
    </form>
  );
}
