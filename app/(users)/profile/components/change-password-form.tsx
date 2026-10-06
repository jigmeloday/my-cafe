"use client";

import { Field } from "@/components/shared/field";
import { FormMessage } from "@/components/shared/form-message";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { useActionForm } from "@/hooks/use-action-form";
import { changePasswordSchema } from "@/lib/validations/profile.schema";
import { changePasswordAction } from "@/server/actions/account.actions";

import { PROFILE_COPY } from "../constant/profile.constant";

export function ChangePasswordForm() {
  const { form, submit, result, pending } = useActionForm(
    changePasswordSchema,
    changePasswordAction,
    { currentPassword: "", password: "", confirmPassword: "" },
  );
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={submit} noValidate className="max-w-xl space-y-4">
      {result && !result.ok && (
        <FormMessage tone="error">{result.error}</FormMessage>
      )}
      <Field
        label="Current password"
        htmlFor="currentPassword"
        error={errors.currentPassword?.message}
      >
        <PasswordInput
          id="currentPassword"
          autoComplete="current-password"
          aria-invalid={!!errors.currentPassword}
          {...register("currentPassword")}
        />
      </Field>
      <Field
        label="New password"
        htmlFor="newPassword"
        hint="At least 8 characters."
        error={errors.password?.message}
      >
        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </Field>
      <Field
        label="Confirm new password"
        htmlFor="confirmNewPassword"
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmNewPassword"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Updating…" : PROFILE_COPY.passwordSubmit}
      </Button>
    </form>
  );
}
