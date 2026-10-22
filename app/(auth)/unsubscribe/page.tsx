import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { FormMessage } from "@/components/shared/form-message";

import { UnsubscribeButton } from "./components/unsubscribe-button";
import { UNSUBSCRIBE_COPY } from "./constant/unsubscribe.constant";

// The address carries a private token: don't send it on as a referrer, don't cache the page.
export const metadata: Metadata = { title: "Unsubscribe — Nook", referrer: "no-referrer" };
export const dynamic = "force-dynamic";

/** Where the unsubscribe link in a promotional email lands. Works without signing in. */
export default async function UnsubscribePage({ searchParams }: PageProps<"/unsubscribe">) {
  const { token } = await searchParams;
  const value = typeof token === "string" ? token : "";

  return (
    <AuthCard
      title={UNSUBSCRIBE_COPY.title}
      description={UNSUBSCRIBE_COPY.description}
      footerText={UNSUBSCRIBE_COPY.footerText}
      footerLink={UNSUBSCRIBE_COPY.footerLink}
    >
      {value ? <UnsubscribeButton token={value} /> : <FormMessage tone="error">{UNSUBSCRIBE_COPY.missing}</FormMessage>}
    </AuthCard>
  );
}
