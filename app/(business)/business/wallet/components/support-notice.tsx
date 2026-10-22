import Link from "next/link";
import { Headset } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";

import { WALLET_COPY } from "../constant/wallet.constant";

/** Shown instead of the buy buttons while online payment isn't connected: tells owners how to buy coins today. */
export function SupportNotice() {
  return (
    <div role="status" className="flex flex-col gap-4 rounded-2xl bg-maroon-soft p-5 sm:flex-row sm:items-center sm:p-6">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface text-primary">
        <Headset className="size-6" />
      </span>
      <div className="flex-1 space-y-1">
        <p className="font-semibold">{WALLET_COPY.supportTitle}</p>
        <p className="text-sm text-muted-foreground">{WALLET_COPY.supportText}</p>
        <p className="text-sm text-muted-foreground">
          {WALLET_COPY.supportEmail}{" "}
          <a href={`mailto:${LEGAL.contactEmail}`} className="font-medium text-foreground underline underline-offset-2">
            {LEGAL.contactEmail}
          </a>
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/contact" />} className="sm:shrink-0">
        {WALLET_COPY.supportAction}
      </Button>
    </div>
  );
}
