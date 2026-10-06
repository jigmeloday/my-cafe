"use client";

import { useState, useTransition } from "react";

import type { ActionResult } from "@/server/actions/action.type";

export function useAction<T>(action: (input: T) => Promise<ActionResult>) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (input: T) => {
    setResult(null);
    startTransition(async () => setResult(await action(input)));
  };

  return { run, result, pending };
}
