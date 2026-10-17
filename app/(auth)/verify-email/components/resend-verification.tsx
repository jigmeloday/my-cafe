"use client";

import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useCountdown } from "@/hooks/use-countdown";
import { resendVerificationAction } from "@/server/actions/auth.actions";

import { COOLDOWN, VERIFY_COPY } from "../constant/verify-email.constant";

/** Starts already counting down: an email was just sent, so a second one has to wait. */
export function ResendVerification({ email }: { email: string }) {
  const { left, restart } = useCountdown(COOLDOWN);
  const { run, result, pending } = useAction(resendVerificationAction);

  return (
    <div className="space-y-3">
      {result && <FormMessage tone={result.ok ? "success" : "error"}>{result.ok ? (result.message ?? "Sent.") : result.error}</FormMessage>}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={left > 0 || pending}
        onClick={() => run({ email }, restart)}
      >
        {pending ? "Sending…" : left > 0 ? VERIFY_COPY.resendIn(left) : VERIFY_COPY.resend}
      </Button>
    </div>
  );
}
