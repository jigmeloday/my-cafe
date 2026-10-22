"use client";

import { contactEventType } from "@/lib/track-events";
import { trackBusiness } from "@/lib/track-client";

interface ContactLinkProps {
  slug: string;
  /** Which contact line this is ("phone", "website"...), so the right click is counted. */
  contactKey: string;
  href: string;
  children: React.ReactNode;
}

/** A phone, email, website or social link on a business's page. Counts the click, then follows the link as usual. */
export function ContactLink({ slug, contactKey, href, children }: ContactLinkProps) {
  const type = contactEventType(contactKey);
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className="truncate hover:text-foreground hover:underline"
      onClick={type ? () => trackBusiness(slug, type) : undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
