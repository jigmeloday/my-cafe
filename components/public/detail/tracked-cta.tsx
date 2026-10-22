"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/track-client";

interface TrackedCtaProps {
  promotionId: string;
  label: string;
  href: string;
  /** Counts the click as a WhatsApp chat instead of an ordinary click. */
  chat?: boolean;
}

/** The promotion's main button. Counts a click, then goes to the business's link, phone or site. */
export function TrackedCta({ promotionId, label, href, chat }: TrackedCtaProps) {
  const external = /^https?:/.test(href);
  return (
    <Button
      size="lg"
      className="w-full"
      nativeButton={false}
      render={<a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => trackEvent(promotionId, chat ? "WHATSAPP" : "CLICK")} />}
    >
      {label}
    </Button>
  );
}
