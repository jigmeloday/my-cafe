import Link from "next/link";

import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { Photo } from "@/components/shared/photo";

import { SHOP_LINE_ICONS } from "../constant/detail.constant";
import type { DetailShop, ShopLine } from "../model/detail.type";

interface ShopDetailsProps {
  shop: DetailShop;
  /** The business's contact lines. */
  lines?: ShopLine[];
  logo?: string;
}

export function ShopDetails({ shop, lines, logo }: ShopDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {logo ? (
          <Photo src={logo} sizes="48px" className="size-12 shrink-0 rounded-full" />
        ) : (
          <ImagePlaceholder label="Logo" className="size-12 shrink-0 rounded-full" />
        )}
        <div className="min-w-0">
          <h6 className="truncate">
            <Link href={shop.href} className="hover:underline">
              {shop.name}
            </Link>
          </h6>
          <p className="truncate text-sm text-muted-foreground">{shop.area}</p>
        </div>
      </div>
      <ul className="space-y-3 text-sm">
        {(lines ?? []).map((line) => {
          const Icon = SHOP_LINE_ICONS[line.key];
          const href = line.href;
          return (
            <li key={line.key} className="flex items-center gap-3 text-muted-foreground">
              <Icon className="size-4 shrink-0 text-foreground" />
              {href ? (
                <a href={href} className="truncate hover:text-foreground hover:underline" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {line.text}
                </a>
              ) : (
                <span className="truncate">{line.text}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
