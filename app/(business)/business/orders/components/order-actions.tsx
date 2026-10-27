"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import type { ActionResult } from "@/server/actions/action.type";
import { setOrderStatusAction } from "@/server/actions/order.actions";

import { ORDERS_COPY as COPY } from "../constant/orders.constant";

interface OrderActionsProps {
  id: string;
  status: "PLACED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  item: string;
  customer: string;
  onResult: (result: ActionResult) => void;
}

/** What the seller can do next with one order: confirm it, complete it or cancel it. */
export function OrderActions({ id, status, item, customer, onResult }: OrderActionsProps) {
  const [cancelling, setCancelling] = useState(false);
  const { run, pending } = useActionRunner(onResult);

  if (status === "COMPLETED" || status === "CANCELLED") return null;

  return (
    <div className="flex justify-end gap-1">
      {status === "PLACED" ? (
        <Button size="sm" disabled={pending} onClick={() => run(setOrderStatusAction, id, "CONFIRMED")}>{COPY.confirm}</Button>
      ) : (
        <Button size="sm" disabled={pending} onClick={() => run(setOrderStatusAction, id, "COMPLETED")}>{COPY.complete}</Button>
      )}
      <Button size="sm" variant="ghost" disabled={pending} onClick={() => setCancelling(true)}>{COPY.cancel}</Button>
      <ConfirmDialog
        open={cancelling}
        onOpenChange={setCancelling}
        title={COPY.cancelTitle}
        description={COPY.cancelBody(item, customer)}
        confirmLabel={COPY.cancelConfirm}
        cancelLabel={COPY.keep}
        onConfirm={() => run(setOrderStatusAction, id, "CANCELLED")}
      />
    </div>
  );
}
