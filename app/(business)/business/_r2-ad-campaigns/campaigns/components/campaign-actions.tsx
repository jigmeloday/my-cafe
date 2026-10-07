"use client";

import Link from "next/link";
import { useState } from "react";
import { Pause, Pencil, Play } from "lucide-react";

import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import type { ActionResult } from "@/server/actions/action.type";
import {
  pauseCampaignAction,
  resumeCampaignAction,
} from "@/server/actions/campaign.actions";

import { CAMPAIGNS_COPY } from "../constant/campaign.constant";
import type { CampaignItem } from "../model/campaign.type";

export function CampaignActions({ item }: { item: CampaignItem }) {
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const { run, pending } = useActionRunner(setNotice);
  const finished = item.status === "COMPLETED" || item.status === "CANCELLED";

  if (finished) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {item.status === "ACTIVE" && (
          <Button
            variant="secondary"
            disabled={pending}
            onClick={() => run(pauseCampaignAction, item.id)}
          >
            <Pause /> {CAMPAIGNS_COPY.pause}
          </Button>
        )}
        {item.status === "PAUSED" && (
          <Button
            disabled={pending}
            onClick={() => run(resumeCampaignAction, item.id)}
          >
            <Play /> {CAMPAIGNS_COPY.resume}
          </Button>
        )}
        <Button
          render={<Link href={`/business/campaigns/${item.id}/edit`} />}
          variant="secondary"
        >
          <Pencil /> {CAMPAIGNS_COPY.edit}
        </Button>
      </div>
      {notice && !notice.ok && (
        <FormMessage tone="error">{notice.error}</FormMessage>
      )}
    </div>
  );
}
