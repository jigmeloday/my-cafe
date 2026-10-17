"use client";

import { useState } from "react";
import { Check, Flag, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import { resolveReportAction } from "@/server/actions/admin.actions";
import type { ActionResult } from "@/server/actions/action.type";

import { MODERATION_COPY } from "../constant/report.constant";
import type { Report, ReportDecision } from "../model/report.type";

interface ReportActionsProps {
  report: Report;
  onResult: (result: ActionResult) => void;
}

export function ReportActions({ report, onResult }: ReportActionsProps) {
  const [confirmRemove, setConfirmRemove] = useState(false);
  const { run, pending } = useActionRunner(onResult);
  const decide = (decision: ReportDecision) =>
    run(resolveReportAction, { id: report.id, decision });

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={pending}
        onClick={() => decide("DISMISSED")}
      >
        <Check /> {MODERATION_COPY.dismiss}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={pending}
        onClick={() => decide("WARNED")}
      >
        <Flag /> {MODERATION_COPY.warn}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => setConfirmRemove(true)}
      >
        <Trash2 /> {MODERATION_COPY.remove}
      </Button>
      <ConfirmDialog
        open={confirmRemove}
        onOpenChange={setConfirmRemove}
        title={MODERATION_COPY.removeTitle}
        description={`“${report.promotionTitle}” will be taken off kuzu and ${report.businessName} is told why.`}
        confirmLabel={MODERATION_COPY.removeConfirm}
        cancelLabel="Cancel"
        onConfirm={() => decide("REMOVED")}
      />
    </div>
  );
}
