import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/server/actions/action.type";

import { FormMessage } from "./form-message";

interface ActionFormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  result: ActionResult | null;
  pending: boolean;
  /** False when nothing has changed, which turns the button off. Leave out to always allow saving. */
  dirty?: boolean;
  submitLabel: string;
  className?: string;
  children: React.ReactNode;
}

export function ActionForm({
  onSubmit,
  result,
  pending,
  dirty = true,
  submitLabel,
  className,
  children,
}: ActionFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("max-w-xl space-y-4", className)}
    >
      {result && !result.ok && (
        <FormMessage tone="error">{result.error}</FormMessage>
      )}
      {result?.ok && (
        <FormMessage tone="success">{result.message ?? "Saved."}</FormMessage>
      )}
      {children}
      <Button type="submit" disabled={pending || !dirty}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
