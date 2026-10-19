"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewKycAction } from "@/server/actions/kyc.actions";

/** Approve, or send back with a reason the owner can act on. */
export function ReviewPanel({ id }: { id: string }) {
  const router = useRouter();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const decide = (decision: "APPROVED" | "REJECTED") =>
    startTransition(async () => {
      setError(null);
      const result = await reviewKycAction({ id, decision, note });
      if (result.ok) {
        setDone(result.message ?? "Done.");
        router.refresh();
      } else setError(result.error);
    });

  if (done) return <FormMessage tone="success">{done}</FormMessage>;

  return (
    <div className="space-y-3 rounded-xl border bg-surface p-4">
      {error && <FormMessage tone="error">{error}</FormMessage>}
      {rejecting ? (
        <div className="space-y-3">
          <Textarea label="What should the owner fix?" hint="They will see this exactly as written." rows={4} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="destructive" disabled={pending} onClick={() => decide("REJECTED")}>
              {pending ? "Sending…" : "Send back"}
            </Button>
            <Button variant="ghost" disabled={pending} onClick={() => setRejecting(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button disabled={pending} onClick={() => decide("APPROVED")}>
            {pending ? "Saving…" : "Approve and verify"}
          </Button>
          <Button variant="secondary" disabled={pending} onClick={() => setRejecting(true)}>
            Send back with a reason
          </Button>
        </div>
      )}
    </div>
  );
}
