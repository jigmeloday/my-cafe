import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { SHOP_DETAILS } from "../constant/detail.constant";
import type { DetailShop } from "../model/detail.type";

export function ShopDetails({ shop }: { shop: DetailShop }) {
  const subtitle = [shop.category, shop.area].filter(Boolean).join(" · ");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ImagePlaceholder
          label="Logo"
          className="size-12 shrink-0 rounded-full"
        />
        <div className="min-w-0">
          <h6 className="truncate">{shop.name}</h6>
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ul className="space-y-3 text-sm">
        {SHOP_DETAILS.map(({ key, icon: Icon, text }) => (
          <li
            key={key}
            className="flex items-center gap-3 text-muted-foreground"
          >
            <Icon className="size-4 shrink-0 text-foreground" />
            <span className="truncate">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
