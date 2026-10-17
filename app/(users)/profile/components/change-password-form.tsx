"use client";

import { FormMessage } from "@/components/shared/form-message";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { useActionForm } from "@/hooks/use-action-form";
import { changePasswordSchema } from "@/lib/validations/profile.schema";
import { changePasswordAction } from "@/server/actions/account.actions";

import { PROFILE_COPY } from "../constant/profile.constant";

export function ChangePasswordForm() {
  const { form, submit, result, pending, dirty } = useActionForm(
    changePasswordSchema,
    changePasswordAction,
    { currentPassword: "", password: "", confirmPassword: "" },
    { clearOnSuccess: true },
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
      {result?.ok && (
        <FormMessage tone="success">{result.message ?? "Saved."}</FormMessage>
      )}
      <PasswordInput label="Current password" error={errors.currentPassword?.message} autoComplete="current-password" {...register("currentPassword")} />
      <PasswordInput label="New password" hint="At least 8 characters." error={errors.password?.message} autoComplete="new-password" {...register("password")} />
      <PasswordInput label="Confirm new password" error={errors.confirmPassword?.message} autoComplete="new-password" {...register("confirmPassword")} />
      <Button type="submit" disabled={pending || !dirty}>
        {pending ? "Updating…" : PROFILE_COPY.passwordSubmit}
      </Button>
    </form>
  );
}
