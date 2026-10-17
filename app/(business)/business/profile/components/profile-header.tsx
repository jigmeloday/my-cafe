import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PROFILE_COPY } from "../constant/profile.constant";

export function ProfileHeader({ slug }: { slug: string | null }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1>{PROFILE_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{PROFILE_COPY.subtitle}</p>
      </div>
      {slug && (
        <Button render={<Link href={`/businesses/${slug}`} />} variant="secondary">
          <ExternalLink /> {PROFILE_COPY.viewPublic}
        </Button>
      )}
    </header>
  );
}
