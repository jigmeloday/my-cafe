"use client";

import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { unsubscribeAction } from "@/server/actions/unsubscribe.actions";

import { UNSUBSCRIBE_COPY } from "../constant/unsubscribe.constant";

/** Changing anything needs this press, so a mail scanner opening the link can't unsubscribe anyone. */
export function UnsubscribeButton({ token }: { token: string }) {
  const { run, result, pending } = useAction(unsubscribeAction);
  const done = result?.ok === true;

  return (
    <div className="space-y-3">
      {result && <FormMessage tone={result.ok ? "success" : "error"}>{result.ok ? (result.message ?? "Done.") : result.error}</FormMessage>}
      {!done && (
        <Button type="button" size="lg" className="w-full" disabled={pending} onClick={() => run(token)}>
          {pending ? UNSUBSCRIBE_COPY.pending : UNSUBSCRIBE_COPY.submit}
        </Button>
      )}
    </div>
  );
}
