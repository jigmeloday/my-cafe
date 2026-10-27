import { FollowButton } from "@/components/shared/follow-button";

import { DETAIL_KINDS, SHOP_LABEL } from "../constant/detail.constant";
import type { DetailData } from "../model/detail.type";
import { ShopDetails } from "./shop-details";
import { EventSeat } from "./event-seat";
import { OrderItem } from "./order-item";
import { TrackedCta } from "./tracked-cta";

export function DetailAside({ detail }: { detail: DetailData }) {
  const { asideLabel, asideNote } = DETAIL_KINDS[detail.kind];

  return (
    <aside className="space-y-5 rounded-3xl bg-card p-6 shadow-[0_6px_20px_rgb(0_0_0/0.12)] ring-1 ring-black/5 lg:sticky lg:top-24">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{asideLabel}</p>
        <p className="text-2xl font-semibold tracking-tight">
          {detail.highlight}
        </p>
        {detail.price && <p className="text-lg font-semibold text-primary">{detail.price}</p>}
        <p className="text-sm text-muted-foreground">{asideNote}</p>
        {detail.promotionId && detail.orderLink && (
          <div className="pt-2">
            <TrackedCta promotionId={detail.promotionId} label={detail.orderLink.label} href={detail.orderLink.href} chat={detail.orderLink.chat} />
          </div>
        )}
        {detail.promotionId && detail.orderable && (
          <div className="pt-2">
            <OrderItem promotionId={detail.promotionId} path={`/promotions/${detail.slug}`} />
          </div>
        )}
        {detail.promotionId && detail.reserveLink && (
          <div className="pt-2">
            <TrackedCta promotionId={detail.promotionId} label={detail.reserveLink.label} href={detail.reserveLink.href} />
          </div>
        )}
        {detail.promotionId && detail.kind === "event" && (
          <div className="pt-2">
            <EventSeat promotionId={detail.promotionId} path={`/events/${detail.slug}`} />
          </div>
        )}
        {detail.promotionId && detail.cta && (
          <div className="pt-2">
            <TrackedCta promotionId={detail.promotionId} label={detail.cta.label} href={detail.cta.href} chat={detail.cta.chat} variant={detail.reservable || detail.orderable || detail.orderLink ? "secondary" : "default"} />
          </div>
        )}
      </div>
      <div className="space-y-4 border-t pt-5">
        <p className="text-sm font-semibold">{SHOP_LABEL}</p>
        <ShopDetails shop={detail.shop} lines={detail.shopLines} logo={detail.shopLogo} />
        <FollowButton href={detail.shop.href} size="lg" className="w-full" />
      </div>
    </aside>
  );
}
