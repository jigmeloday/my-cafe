import { FollowButton } from "@/components/shared/follow-button";

import { DETAIL_KINDS, SHOP_LABEL } from "../constant/detail.constant";
import type { DetailData } from "../model/detail.type";
import { ShopDetails } from "./shop-details";

export function DetailAside({ detail }: { detail: DetailData }) {
  const { asideLabel, asideNote } = DETAIL_KINDS[detail.kind];

  return (
    <aside className="space-y-5 rounded-3xl bg-card p-6 shadow-[0_6px_20px_rgb(0_0_0/0.12)] ring-1 ring-black/5 lg:sticky lg:top-24">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{asideLabel}</p>
        <p className="text-2xl font-semibold tracking-tight">
          {detail.highlight}
        </p>
        <p className="text-sm text-muted-foreground">{asideNote}</p>
      </div>
      <div className="space-y-4 border-t pt-5">
        <p className="text-sm font-semibold">{SHOP_LABEL}</p>
        <ShopDetails shop={detail.shop} />
        <FollowButton size="lg" className="w-full" />
      </div>
    </aside>
  );
}
