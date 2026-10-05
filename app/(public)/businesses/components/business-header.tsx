import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { FollowButton } from "@/components/shared/follow-button";

import { BUSINESS_COPY } from "../constant/business.constant";
import type { BusinessProfile } from "../model/business.type";

export function BusinessHeader({ business }: { business: BusinessProfile }) {
  return (
    <header className="space-y-3 pt-12 sm:pt-14">
      <Link
        href={BUSINESS_COPY.backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> {BUSINESS_COPY.back}
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1>{business.name}</h1>
            {business.badge && (
              <span className="rounded-full bg-maroon-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                {business.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {[business.category, business.area, business.openedLabel]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <FollowButton />
      </div>
      {business.openingOffer && (
        <p className="inline-flex items-center gap-2 rounded-full bg-maroon-soft px-3 py-1.5 text-sm">
          <span className="font-semibold text-primary">
            {BUSINESS_COPY.openingOffer}
          </span>
          {business.openingOffer}
        </p>
      )}
    </header>
  );
}
