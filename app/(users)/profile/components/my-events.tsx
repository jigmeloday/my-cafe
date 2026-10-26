"use client";

import Link from "next/link";
import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import { formatDate } from "@/lib/formatters/date";
import { cancelRegistrationAction } from "@/server/actions/registration.actions";
import type { ActionResult } from "@/server/actions/action.type";

import { MY_EVENTS_COPY as COPY } from "../constant/my-events.constant";
import type { MyEvent } from "../model/my-events.type";

/** The events the person has a seat at, with a way to give a seat back. */
export function MyEvents({ events }: { events: MyEvent[] }) {
  const [target, setTarget] = useState<MyEvent | null>(null);
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const { run, pending } = useActionRunner(setNotice);

  if (events.length === 0) {
    return (
      <EmptyState
        title={COPY.emptyTitle}
        description={COPY.emptyDescription}
        action={
          <Button nativeButton={false} render={<Link href="/events" />}>
            {COPY.browse}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {notice && !notice.ok && <p role="alert" className="text-sm text-destructive">{notice.error}</p>}
      <ul className="divide-y rounded-xl border bg-surface">
        {events.map((e) => (
          <li key={e.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1 space-y-0.5">
              <Link href={e.href} className="block truncate font-semibold hover:underline">
                {e.title}
              </Link>
              <p className="truncate text-sm text-muted-foreground">
                {[e.businessName, e.when && formatDate(e.when), e.location].filter(Boolean).join(" · ")}
              </p>
            </div>
            {e.over ? (
              <StatusBadge tone="neutral">{COPY.over}</StatusBadge>
            ) : (
              <Button variant="ghost" size="sm" disabled={pending} onClick={() => setTarget(e)}>
                {COPY.cancel}
              </Button>
            )}
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title={COPY.cancelTitle}
        description={COPY.cancelBody(target?.title ?? "")}
        confirmLabel={COPY.cancelConfirm}
        cancelLabel={COPY.keep}
        onConfirm={() => target && run(cancelRegistrationAction, target.promotionId)}
      />
    </div>
  );
}
