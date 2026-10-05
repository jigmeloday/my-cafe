import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { FavoriteButton } from "@/components/shared/favorite-button";

import { DETAIL_KINDS } from "../constant/detail.constant";
import type { DetailData } from "../model/detail.type";

export function DetailHeader({ detail }: { detail: DetailData }) {
  const { backHref, backLabel } = DETAIL_KINDS[detail.kind];

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
        <FavoriteButton className="shrink-0 border" />
      </div>
    </header>
  );
}
