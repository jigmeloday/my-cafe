"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, XCircle } from "lucide-react";

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
import { cancelEmailCampaignAction } from "@/server/actions/email-campaign.actions";

import type { EmailCampaignItem } from "../model/email-campaign.type";
import { canEdit } from "../utils/email-campaign.utils";

interface CampaignRowActionsProps {
  item: EmailCampaignItem;
  onResult: (result: ActionResult) => void;
}

export function CampaignRowActions({
  item,
  onResult,
}: CampaignRowActionsProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            render={<Link href={`/business/campaigns/${item.id}`} />}
          >
            <Eye /> View
          </DropdownMenuItem>
          {canEdit(item.status) && (
            <DropdownMenuItem
              render={<Link href={`/business/campaigns/${item.id}/edit`} />}
            >
              <Pencil /> Edit
            </DropdownMenuItem>
          )}
          {item.status === "SCHEDULED" && (
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
        description={`“${item.name}” won't be sent. You can still edit it and schedule it again.`}
        confirmLabel="Cancel campaign"
        onConfirm={() => run(cancelEmailCampaignAction, item.id)}
      />
    </>
  );
}
