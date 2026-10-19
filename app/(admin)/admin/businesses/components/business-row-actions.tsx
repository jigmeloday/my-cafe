"use client";

import Link from "next/link";
import { useState } from "react";
import { Ban, BadgeCheck, ExternalLink, FileCheck, MoreHorizontal, RotateCcw } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useActionRunner } from "@/hooks/use-action-runner";
import type { ActionResult } from "@/server/actions/action.type";
import { reinstateBusinessAction, suspendBusinessAction, verifyBusinessAction } from "@/server/actions/admin.actions";

import type { AdminBusiness } from "../model/business.type";

interface BusinessRowActionsProps {
  item: AdminBusiness;
  onResult: (result: ActionResult) => void;
}

export function BusinessRowActions({ item, onResult }: BusinessRowActionsProps) {
  const [dialog, setDialog] = useState<"suspend" | "verify" | null>(null);
  const { run } = useActionRunner(onResult);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${item.name}`} />}>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          {item.status !== "SUSPENDED" && (
            <DropdownMenuItem render={<Link href={`/businesses/${item.slug}`} />}>
              <ExternalLink /> View public page
            </DropdownMenuItem>
          )}
          {item.waitingRequestId && (
            <DropdownMenuItem render={<Link href={`/admin/verification/${item.waitingRequestId}`} />}>
              <FileCheck /> Review verification documents
            </DropdownMenuItem>
          )}
          {item.status === "PENDING" && (
            <DropdownMenuItem onClick={() => setDialog("verify")}>
              <BadgeCheck /> Verify without documents
            </DropdownMenuItem>
          )}
          {item.status === "SUSPENDED" && (
            <DropdownMenuItem onClick={() => run(reinstateBusinessAction, item.id)}>
              <RotateCcw /> Reinstate
            </DropdownMenuItem>
          )}
          {item.status !== "SUSPENDED" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDialog("suspend")}>
                <Ban /> Suspend
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={dialog === "verify"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Verify this business?"
        description={`“${item.name}” will get the Verified badge without sending an ID or licence. Only do this for a business you already know. It is recorded in the audit log.`}
        confirmLabel="Verify"
        cancelLabel="Cancel"
        onConfirm={() => run(verifyBusinessAction, item.id)}
      />
      <ReasonDialog
        open={dialog === "suspend"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Suspend this business?"
        description={`“${item.name}” and everything it posted will be hidden from the public until you reinstate it. The owner will see your reason.`}
        label="Reason (shown to the owner)"
        confirmLabel="Suspend"
        onConfirm={(reason) => run(suspendBusinessAction, { id: item.id, reason })}
      />
    </>
  );
}
