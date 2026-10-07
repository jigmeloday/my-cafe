"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, XCircle } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import type { ActionResult } from "@/server/actions/action.type";
import { cancelEmailCampaignAction } from "@/server/actions/email-campaign.actions";

import { EMAIL_COPY } from "../constant/email-campaign.constant";
import type { EmailCampaignItem } from "../model/email-campaign.type";
import { canEdit } from "../utils/email-campaign.utils";

export function CampaignActions({ item }: { item: EmailCampaignItem }) {
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { run, pending } = useActionRunner(setNotice);

  if (!canEdit(item.status)) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          render={<Link href={`/business/campaigns/${item.id}/edit`} />}
          variant="secondary"
        >
          <Pencil /> {EMAIL_COPY.edit}
        </Button>
        {item.status === "SCHEDULED" && (
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => setConfirmCancel(true)}
          >
            <XCircle /> {EMAIL_COPY.cancel}
          </Button>
        )}
      </div>
      {notice && !notice.ok && (
        <FormMessage tone="error">{notice.error}</FormMessage>
      )}
      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel this campaign?"
        description={`“${item.name}” won't be sent. You can still edit it and schedule it again.`}
        confirmLabel={EMAIL_COPY.cancel}
        onConfirm={() => run(cancelEmailCampaignAction, item.id)}
      />
    </div>
  );
}
