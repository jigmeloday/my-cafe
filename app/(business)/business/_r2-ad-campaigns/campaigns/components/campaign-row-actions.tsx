"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  XCircle,
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
import type { ActionResult } from "@/server/actions/action.type";
import {
  cancelCampaignAction,
  pauseCampaignAction,
  resumeCampaignAction,
} from "@/server/actions/campaign.actions";

import type { CampaignItem } from "../model/campaign.type";

interface CampaignRowActionsProps {
  item: CampaignItem;
  onResult: (result: ActionResult) => void;
}

export function CampaignRowActions({
  item,
  onResult,
}: CampaignRowActionsProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { run } = useActionRunner(onResult);
  const finished = item.status === "COMPLETED" || item.status === "CANCELLED";

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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            render={<Link href={`/business/campaigns/${item.id}`} />}
          >
            <Eye /> View
          </DropdownMenuItem>
          {!finished && (
            <DropdownMenuItem
              render={<Link href={`/business/campaigns/${item.id}/edit`} />}
            >
              <Pencil /> Edit
            </DropdownMenuItem>
          )}
          {item.status === "ACTIVE" && (
            <DropdownMenuItem onClick={() => run(pauseCampaignAction, item.id)}>
              <Pause /> Pause
            </DropdownMenuItem>
          )}
          {item.status === "PAUSED" && (
            <DropdownMenuItem
              onClick={() => run(resumeCampaignAction, item.id)}
            >
              <Play /> Resume
            </DropdownMenuItem>
          )}
          {!finished && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmCancel(true)}
              >
                <XCircle /> Cancel campaign
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel this campaign?"
        description={`“${item.name}” will stop right away. Money you haven't spent stays in your wallet.`}
        confirmLabel="Cancel campaign"
        onConfirm={() => run(cancelCampaignAction, item.id)}
      />
    </>
  );
}
