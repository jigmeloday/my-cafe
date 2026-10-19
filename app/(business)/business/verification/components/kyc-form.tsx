"use client";

import Link from "next/link";

import { SectionCard } from "@/components/business/section-card";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { KYC_DOCS } from "@/lib/kyc";
import { kycSchema } from "@/lib/validations/kyc.schema";
import { submitKycAction } from "@/server/actions/kyc.actions";

import { KYC_COPY } from "../constant/kyc.constant";
import { KycUpload } from "./kyc-upload";

const FIELD = { id: "idDocKey", license: "licenseDocKey", premises: "premisesKey" } as const;

export function KycForm() {
  const { form, submit, result, pending } = useActionForm(kycSchema, submitKycAction, {
    ownerName: "",
    idNumber: "",
    licenseNumber: "",
    idDocKey: "",
    licenseDocKey: "",
    premisesKey: "",
    consent: false as unknown as true,
  });
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  if (result?.ok) return <FormMessage tone="success">{result.message ?? "Sent."}</FormMessage>;

  return (
    <form onSubmit={submit} noValidate className="max-w-2xl space-y-4">
      {result && !result.ok && <FormMessage tone="error">{result.error}</FormMessage>}
      <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        {KYC_COPY.privacy}{" "}
        <Link href="/privacy#verification" target="_blank" className="font-medium text-foreground underline underline-offset-2">
          How we protect them
        </Link>
        .
      </p>
      <SectionCard title="Your details">
        <div className="space-y-4">
          <Input label="Full name, as on your ID" error={errors.ownerName?.message} autoComplete="name" {...register("ownerName")} />
          <Input label="ID number (11 digits)" hint="Your citizenship ID (CID) number." error={errors.idNumber?.message} inputMode="numeric" maxLength={11} autoComplete="off" {...register("idNumber")} />
          <Input label="Trade licence number" error={errors.licenseNumber?.message} autoComplete="off" {...register("licenseNumber")} />
        </div>
      </SectionCard>
      <SectionCard title="Your documents">
        <div className="space-y-5">
          {KYC_DOCS.map((doc) => (
            <KycUpload
              key={doc.kind}
              kind={doc.kind}
              label={doc.label}
              hint={doc.hint}
              required={doc.required}
              onChange={(key) => setValue(FIELD[doc.kind], key, { shouldDirty: true, shouldValidate: true })}
              error={errors[FIELD[doc.kind]]?.message}
            />
          ))}
        </div>
      </SectionCard>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1 size-4 accent-[var(--color-primary)]" {...register("consent")} />
        <span>{KYC_COPY.consent}</span>
      </label>
      {errors.consent?.message && (
        <p role="alert" className="text-sm text-destructive">
          {errors.consent.message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : KYC_COPY.submit}
      </Button>
    </form>
  );
}
