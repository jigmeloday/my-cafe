"use client";

import { useTransition } from "react";

import type { ActionResult } from "@/server/actions/action.type";

/** Runs a server action and reports its result, e.g. for row menus that show one shared notice. */
export function useActionRunner(onResult: (result: ActionResult) => void) {
  const [pending, startTransition] = useTransition();

  const run = <Args extends unknown[]>(
    action: (...args: Args) => Promise<ActionResult>,
    ...args: Args
  ) => startTransition(async () => onResult(await action(...args)));

  return { run, pending };
}
