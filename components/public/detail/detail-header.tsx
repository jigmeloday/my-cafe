import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { ReportButton } from "@/components/public/report-button";
import { ShareButton } from "@/components/shared/share-button";
import { FavoriteButton } from "@/components/shared/favorite-button";

import { DETAIL_KINDS } from "../constant/detail.constant";
import type { DetailData } from "../model/detail.type";

export function DetailHeader({ detail }: { detail: DetailData }) {
  const config = DETAIL_KINDS[detail.kind];
  const backHref = detail.back?.href ?? config.backHref;
  const backLabel = detail.back?.label ?? config.backLabel;

  return (
    <header className="space-y-3">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> {backLabel}
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {detail.badge && (
            <span className="inline-block rounded-full bg-maroon-soft px-3 py-1 text-xs font-semibold text-primary">
              {detail.badge}
            </span>
          )}
          <h1>{detail.title}</h1>
          <p className="text-muted-foreground">
            <Link
              href={detail.shop.href}
              className="font-medium text-foreground hover:underline"
            >
              {detail.shop.name}
            </Link>{" "}
            · {detail.shop.area}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ShareButton path={`/${detail.kind === "event" ? "events" : "promotions"}/${detail.slug}`} title={detail.title} story={{ kind: "promotion", slug: detail.slug }} track={{ promotionId: detail.promotionId }} />
          {detail.promotionId && <ReportButton promotionId={detail.promotionId} />}
          <FavoriteButton href={`/${detail.kind === "event" ? "events" : "promotions"}/${detail.slug}`} className="border" />
        </div>
      </div>
    </header>
  );
}
