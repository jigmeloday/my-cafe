"use client";

import { FormMessage } from "@/components/shared/form-message";
import { GoogleIcon } from "@/components/shared/google-icon";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import type { GoogleAuthInput } from "@/lib/validations/auth.schema";
import { googleAuthAction } from "@/server/actions/auth.actions";

interface GoogleAuthButtonProps {
  label: string;
  getInput?: () => GoogleAuthInput;
}

export function GoogleAuthButton({ label, getInput }: GoogleAuthButtonProps) {
  const { run, result, pending } = useAction(googleAuthAction);

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        disabled={pending}
        onClick={() => run(getInput?.() ?? {})}
      >
        <GoogleIcon className="size-5" />
        {label}
      </Button>
      {result && !result.ok && (
        <FormMessage tone="error">{result.error}</FormMessage>
      )}
    </div>
  );
}
