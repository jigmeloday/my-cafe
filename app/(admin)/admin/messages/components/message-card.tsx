"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Mail } from "lucide-react";

import { FormMessage } from "@/components/shared/form-message";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters/date";
import { markMessageDoneAction } from "@/server/actions/contact.actions";
import type { InboxMessage } from "@/services/contact/contact.service";

/** One message. The text is shown as plain text, never as HTML, whatever the sender wrote. */
export function MessageCard({ message }: { message: InboxMessage }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const done = () =>
    startTransition(async () => {
      const result = await markMessageDoneAction(message.id);
      if (result.ok) router.refresh();
      else setError(result.error);
    });

  const reply = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.topicLabel}`)}`;

  return (
    <li className="space-y-3 rounded-xl border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{message.name}</p>
          <p className="text-sm text-muted-foreground">
            {message.email}
            {message.signedIn && " · has an account"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone="info">{message.topicLabel}</StatusBadge>
          <StatusBadge tone={message.status === "OPEN" ? "warning" : "success"}>{message.status === "OPEN" ? "Waiting" : "Done"}</StatusBadge>
        </div>
      </div>
      <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
      <p className="text-xs text-muted-foreground">Sent {formatDateTime(message.sentAt)}</p>
      {error && <FormMessage tone="error">{error}</FormMessage>}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" nativeButton={false} render={<a href={reply} />}>
          <Mail /> Reply by email
        </Button>
        {message.status === "OPEN" && (
          <Button size="sm" disabled={pending} onClick={done}>
            <Check /> {pending ? "Saving…" : "Mark as done"}
          </Button>
        )}
      </div>
    </li>
  );
}
