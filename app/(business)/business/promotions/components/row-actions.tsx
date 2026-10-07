"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleStop, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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
  deletePromotionAction,
  endPromotionAction,
} from "@/server/actions/promotion.actions";

import type { PromotionItem } from "../model/promotion.type";

interface RowActionsProps {
  item: PromotionItem;
  onResult: (result: ActionResult) => void;
}

export function RowActions({ item, onResult }: RowActionsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { run } = useActionRunner(onResult);
  const published = item.status === "PUBLISHED";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${item.values.title}`}
            />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            render={<Link href={`/business/promotions/${item.id}/edit`} />}
          >
            <Pencil /> Edit
          </DropdownMenuItem>
          {published && (
            <DropdownMenuItem onClick={() => run(endPromotionAction, item.id)}>
              <CircleStop /> End promotion
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this promotion?"
        description={`“${item.values.title}” will be removed from discovery. Campaigns that use it will stop.`}
        confirmLabel="Delete"
        onConfirm={() => run(deletePromotionAction, item.id)}
      />
    </>
  );
}
