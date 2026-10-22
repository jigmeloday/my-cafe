"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, TriangleAlert, X } from "lucide-react";

import { useActionRunner } from "@/hooks/use-action-runner";
import { formatDateTime } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";
import { dismissNoticeAction } from "@/server/actions/notice.actions";

import type { Notice, NoticeTone } from "../model/notice.type";

const LOOK: Record<NoticeTone, { box: string; icon: string }> = {
  success: { box: "border-success/30 bg-success/10", icon: "text-success" },
  warning: { box: "border-gold/40 bg-gold/10", icon: "text-[#8a6212]" },
};

/** One short message from Nook, with a close button. It closes at once and stays closed. */
export function NoticeItem({ notice, tone }: { notice: Notice; tone: NoticeTone }) {
  const [closed, setClosed] = useState(false);
  const { run } = useActionRunner(() => undefined);
  if (closed) return null;

  const Icon = tone === "success" ? CircleCheck : TriangleAlert;
  const { box, icon } = LOOK[tone];

  return (
    <li className={cn("flex items-start gap-2.5 rounded-lg border px-3 py-2", box)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", icon)} />
      <div className="min-w-0 flex-1 text-sm">
        <p>
          {notice.href ? (
            <Link href={notice.href} className="font-semibold hover:underline">
              {notice.title}
            </Link>
          ) : (
            <span className="font-semibold">{notice.title}</span>
          )}
          <span className="ml-2 text-xs text-muted-foreground">{formatDateTime(notice.at)}</span>
        </p>
        <p className="text-muted-foreground">{notice.description}</p>
      </div>
      <button
        type="button"
        aria-label={`Close: ${notice.title}`}
        onClick={() => {
          setClosed(true);
          run(dismissNoticeAction, notice.id);
        }}
        className="-mr-1 grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}
