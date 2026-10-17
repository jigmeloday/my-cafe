"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheck,
  ExternalLink,
  MoreHorizontal,
  RotateCcw,
  Ban,
} from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActionRunner } from "@/hooks/use-action-runner";
import {
  reinstateBusinessAction,
  suspendBusinessAction,
  verifyBusinessAction,
} from "@/server/actions/admin.actions";
import type { ActionResult } from "@/server/actions/action.type";

import type { AdminBusiness } from "../model/business.type";

interface BusinessRowActionsProps {
  item: AdminBusiness;
  onResult: (result: ActionResult) => void;
}

export function BusinessRowActions({
  item,
  onResult,
}: BusinessRowActionsProps) {
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const { run } = useActionRunner(onResult);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${item.name}`}
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem render={<Link href={`/businesses/${item.slug}`} />}>
            <ExternalLink /> View public page
          </DropdownMenuItem>
          {item.status === "PENDING" && (
            <DropdownMenuItem
              onClick={() => run(verifyBusinessAction, item.id)}
            >
              <BadgeCheck /> Verify business
            </DropdownMenuItem>
          )}
          {item.status === "SUSPENDED" && (
            <DropdownMenuItem
              onClick={() => run(reinstateBusinessAction, item.id)}
            >
              <RotateCcw /> Reinstate
            </DropdownMenuItem>
          )}
          {item.status !== "SUSPENDED" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmSuspend(true)}
              >
                <Ban /> Suspend
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmSuspend}
        onOpenChange={setConfirmSuspend}
        title="Suspend this business?"
        description={`“${item.name}” and its promotions will be hidden from the public until you reinstate it. The owner is told why.`}
        confirmLabel="Suspend"
        cancelLabel="Cancel"
        onConfirm={() => run(suspendBusinessAction, item.id)}
      />
    </>
  );
}
