"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/track-client";

interface TrackedCtaProps {
  promotionId: string;
  label: string;
  href: string;
}

/** The promotion's main button. Counts a click, then goes to the business's link, phone or site. */
export function TrackedCta({ promotionId, label, href }: TrackedCtaProps) {
  const external = /^https?:/.test(href);
  return (
    <Button
      size="lg"
      className="w-full"
      nativeButton={false}
      render={<a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => trackEvent(promotionId, "CLICK")} />}
    >
      {label}
    </Button>
  );
}
