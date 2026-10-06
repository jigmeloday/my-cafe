import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { BUSINESS_SHELL } from "@/components/business/constant/business-nav.constant";
import { Button } from "@/components/ui/button";

import { PROFILE_COPY } from "../constant/profile.constant";

export function ProfileHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1>{PROFILE_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{PROFILE_COPY.subtitle}</p>
      </div>
      <Button
        render={<Link href={BUSINESS_SHELL.publicHref} />}
        variant="secondary"
      >
        <ExternalLink /> {PROFILE_COPY.viewPublic}
      </Button>
    </header>
  );
}
