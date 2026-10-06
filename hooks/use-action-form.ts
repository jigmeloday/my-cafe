"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import type { ZodType } from "zod";

import type { ActionResult } from "@/server/actions/action.type";

export function useActionForm<T extends FieldValues>(
  schema: ZodType<T, T>,
  action: (values: T) => Promise<ActionResult>,
  defaultValues: DefaultValues<T>,
) {
  const form = useForm<T>({
    resolver: zodResolver(schema as never),
    defaultValues,
  });
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = form.handleSubmit((values) => {
    setResult(null);
    startTransition(async () => setResult(await action(values)));
  });

  return { form, submit, result, pending };
}
