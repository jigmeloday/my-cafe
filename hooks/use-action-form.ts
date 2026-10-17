"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import type { ZodType } from "zod";

import type { ActionResult } from "@/server/actions/action.type";

interface ActionFormOptions {
  /** After a successful save, empty the form again instead of keeping the values (e.g. password fields). */
  clearOnSuccess?: boolean;
}

export function useActionForm<T extends FieldValues>(
  schema: ZodType<T, T>,
  action: (values: T) => Promise<ActionResult>,
  defaultValues: DefaultValues<T>,
  { clearOnSuccess = false }: ActionFormOptions = {},
) {
  const form = useForm<T>({
    resolver: zodResolver(schema as never),
    defaultValues,
  });
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  // Read during render so React Hook Form keeps it up to date.
  const dirty = form.formState.isDirty;

  const submit = form.handleSubmit((values) => {
    // Nothing changed (for example Enter pressed in a field): don't call the server.
    if (!dirty) return;

    setResult(null);
    startTransition(async () => {
      const outcome = await action(values);
      setResult(outcome);
      // The saved values become the new starting point, so Save turns off until the next edit.
      if (outcome.ok) form.reset(clearOnSuccess ? defaultValues : values);
    });
  });

  return { form, submit, result, pending, dirty };
}
