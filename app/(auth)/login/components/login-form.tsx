"use client";

import Link from "next/link";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { OrDivider } from "@/components/auth/or-divider";
import { FormMessage } from "@/components/shared/form-message";
import { Field } from "@/components/shared/field";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { loginSchema } from "@/lib/validations/auth.schema";
import { loginAction } from "@/server/actions/auth.actions";

import { LOGIN_COPY } from "../constant/login.constant";

export function LoginForm() {
  const { form, submit, result, pending } = useActionForm(
    loginSchema,
    loginAction,
    {
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
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            {LOGIN_COPY.forgot}
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Logging in…" : LOGIN_COPY.submit}
        </Button>
      </form>
      <OrDivider />
      <GoogleAuthButton label="Continue with Google" />
    </div>
  );
}
