"use client";

import Link from "next/link";
import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import { formatDate } from "@/lib/formatters/date";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from "@/lib/orders";
import type { ActionResult } from "@/server/actions/action.type";
import { cancelOrderAction } from "@/server/actions/order.actions";

import { MY_ORDERS_COPY as COPY } from "../constant/my-orders.constant";
import type { MyOrder } from "../model/my-orders.type";

/** The person's orders, with a way to take back one the seller hasn't answered yet. */
export function MyOrders({ orders }: { orders: MyOrder[] }) {
  const [target, setTarget] = useState<MyOrder | null>(null);
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const { run, pending } = useActionRunner(setNotice);

  if (orders.length === 0) {
    return (
      <EmptyState
        title={COPY.emptyTitle}
        description={COPY.emptyDescription}
        action={
          <Button nativeButton={false} render={<Link href="/deals" />}>
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
        {orders.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1 space-y-0.5">
              <Link href={o.href} className="block truncate font-semibold hover:underline">{o.title}</Link>
              <p className="truncate text-sm text-muted-foreground">
                {[o.businessName, COPY.qty(o.quantity), o.total, formatDate(o.placedOn)].filter(Boolean).join(" · ")}
              </p>
            </div>
            <StatusBadge tone={ORDER_STATUS_TONES[o.status]}>{ORDER_STATUS_LABELS[o.status]}</StatusBadge>
            {o.status === "PLACED" && (
              <Button variant="ghost" size="sm" disabled={pending} onClick={() => setTarget(o)}>{COPY.cancel}</Button>
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
        onConfirm={() => target && run(cancelOrderAction, target.id)}
      />
    </div>
  );
}
