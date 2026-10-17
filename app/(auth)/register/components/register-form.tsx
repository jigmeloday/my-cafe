"use client";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { OrDivider } from "@/components/auth/or-divider";
import { FormMessage } from "@/components/shared/form-message";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { registerSchema } from "@/lib/validations/auth.schema";
import { registerAction } from "@/server/actions/auth.actions";

import { REGISTER_COPY } from "../constant/register.constant";
import { AccountTypeField } from "./account-type-field";

export function RegisterForm() {
  const { form, submit, result, pending } = useActionForm(
    registerSchema,
    registerAction,
    {
      accountType: "USER",
      name: "",
      email: "",
      password: "",
    },
  );
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <form onSubmit={submit} noValidate className="space-y-4">
        {result && !result.ok && (
          <FormMessage tone="error">{result.error}</FormMessage>
        )}
        <AccountTypeField field={register("accountType")} />
        <Input label="Name" error={errors.name?.message} autoComplete="name" {...register("name")} />
        <Input label="Email" error={errors.email?.message} type="email" autoComplete="email" {...register("email")} />
        <PasswordInput label="Password" hint="At least 8 characters." error={errors.password?.message} autoComplete="new-password" {...register("password")} />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : REGISTER_COPY.submit}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {REGISTER_COPY.terms}
        </p>
      </form>
      <OrDivider />
      <GoogleAuthButton
        label="Sign up with Google"
        getInput={() => ({ accountType: form.getValues("accountType") })}
      />
    </div>
  );
}
