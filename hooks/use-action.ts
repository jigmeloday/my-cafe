"use client";

import { useState, useTransition } from "react";

import type { ActionResult } from "@/server/actions/action.type";

export function useAction<T>(action: (input: T) => Promise<ActionResult>) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  /** Runs the action. `onSuccess` is called only when it worked. */
  const run = (input: T, onSuccess?: () => void) => {
    setResult(null);
    startTransition(async () => {
      const outcome = await action(input);
      setResult(outcome);
      if (outcome.ok) onSuccess?.();
    });
  };

  return { run, result, pending };
}
