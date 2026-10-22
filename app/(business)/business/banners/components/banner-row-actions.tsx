"use client";

import Link from "next/link";
import { useState } from "react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useActionRunner } from "@/hooks/use-action-runner";
import type { ActionResult } from "@/server/actions/action.type";
import { deleteBannerAction } from "@/server/actions/banner.actions";
import type { BannerRow } from "@/services/banner/banner.service";

import { BANNERS_COPY } from "../constant/banner.constant";

const LINK = "font-semibold hover:underline";

/** Edit (while it can still change) and Delete for one banner, with a warning that nothing is refunded. */
export function BannerRowActions({ banner }: { banner: BannerRow }) {
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const { run, pending } = useActionRunner(setNotice);
  const canEdit = !banner.removed && banner.status !== "ended";

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-4">
        {canEdit && (
          <Link href={`/business/banners/${banner.id}/edit`} className={`${LINK} text-primary`}>
            {BANNERS_COPY.edit}
          </Link>
        )}
        {!banner.removed && (
          <button type="button" disabled={pending} onClick={() => setConfirm(true)} className={`${LINK} text-destructive disabled:opacity-50`}>
            {BANNERS_COPY.delete}
          </button>
        )}
      </div>
      {notice && !notice.ok && (
        <p role="alert" className="max-w-56 text-right text-xs font-normal text-destructive">
          {notice.error}
        </p>
      )}
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={BANNERS_COPY.deleteTitle}
        description={BANNERS_COPY.deleteBody(banner.title, banner.status === "active")}
        confirmLabel={BANNERS_COPY.deleteConfirm}
        onConfirm={() => run(deleteBannerAction, banner.id)}
      />
    </div>
  );
}
