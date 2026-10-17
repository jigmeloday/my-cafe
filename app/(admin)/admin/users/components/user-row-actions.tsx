"use client";

import { useState } from "react";
import { Ban, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";

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
import type { ActionResult } from "@/server/actions/action.type";
import {
  deleteUserAction,
  suspendUserAction,
  unsuspendUserAction,
} from "@/server/actions/admin-user.actions";

import { USERS_COPY } from "../constant/user.constant";
import type { AdminUser } from "../model/user.type";

interface UserRowActionsProps {
  item: AdminUser;
  /** True for the signed-in admin's own row. */
  isSelf: boolean;
  onResult: (result: ActionResult) => void;
}

export function UserRowActions({ item, isSelf, onResult }: UserRowActionsProps) {
  const [confirm, setConfirm] = useState<"suspend" | "delete" | null>(null);
  const { run } = useActionRunner(onResult);

  if (isSelf) return <span className="text-xs text-muted-foreground">{USERS_COPY.selfNote}</span>;
  if (item.role === "ADMIN") return <span className="text-xs text-muted-foreground">{USERS_COPY.adminNote}</span>;

  const suspended = item.status === "SUSPENDED";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${item.name}`} />}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {suspended ? (
            <DropdownMenuItem onClick={() => run(unsuspendUserAction, item.id)}>
              <RotateCcw /> Unsuspend
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setConfirm("suspend")}>
              <Ban /> Suspend
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setConfirm("delete")}>
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirm === "suspend"}
        onOpenChange={(open) => !open && setConfirm(null)}
        title="Suspend this user?"
        description={`${item.name} will be signed out right away and can't log in until you unsuspend them.`}
        confirmLabel="Suspend"
        cancelLabel="Cancel"
        onConfirm={() => run(suspendUserAction, item.id)}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        onOpenChange={(open) => !open && setConfirm(null)}
        title="Delete this user?"
        description={`${item.name} (${item.email}) and everything they saved will be permanently deleted. This can't be undone. If you only want to stop them using kuzu, suspend them instead.`}
        confirmLabel="Delete permanently"
        cancelLabel="Cancel"
        onConfirm={() => run(deleteUserAction, item.id)}
      />
    </>
  );
}
