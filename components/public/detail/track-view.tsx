"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/track-client";

/** Counts one view of a promotion when its page opens. Renders nothing. */
export function TrackView({ promotionId }: { promotionId: string }) {
  useEffect(() => {
    trackEvent(promotionId, "VIEW");
  }, [promotionId]);
  return null;
}
