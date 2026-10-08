"use client";

import { useState } from "react";
import { Ban, MoreHorizontal, RotateCcw } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActionRunner } from "@/hooks/use-action-runner";
import {
  reinstateUserAction,
  suspendUserAction,
} from "@/server/actions/admin.actions";
import type { ActionResult } from "@/server/actions/action.type";

import { USERS_COPY } from "../constant/user.constant";
import type { AdminUser } from "../model/user.type";

interface UserRowActionsProps {
  item: AdminUser;
  onResult: (result: ActionResult) => void;
}

export function UserRowActions({ item, onResult }: UserRowActionsProps) {
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const { run } = useActionRunner(onResult);

  if (item.role === "ADMIN") {
    return (
      <span className="text-xs text-muted-foreground">
        {USERS_COPY.adminNote}
      </span>
    );
  }

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
        <DropdownMenuContent align="end" className="w-44">
          {item.status === "SUSPENDED" ? (
            <DropdownMenuItem onClick={() => run(reinstateUserAction, item.id)}>
              <RotateCcw /> Reinstate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setConfirmSuspend(true)}
            >
              <Ban /> Suspend
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmSuspend}
        onOpenChange={setConfirmSuspend}
        title="Suspend this user?"
        description={`${item.name} won't be able to sign in until you reinstate them.`}
        confirmLabel="Suspend"
        cancelLabel="Cancel"
        onConfirm={() => run(suspendUserAction, item.id)}
      />
    </>
  );
}
