"use client";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { OrDivider } from "@/components/auth/or-divider";
import { FormMessage } from "@/components/shared/form-message";
import { Field } from "@/components/shared/field";
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
        <Field label="Name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field
          label="Password"
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
