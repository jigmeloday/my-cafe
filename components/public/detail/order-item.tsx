import { getCurrentUser } from "@/lib/session";
import { profileService } from "@/services/profile/profile.service";
import { orderService } from "@/services/order/order.service";

import { PlaceOrder } from "./place-order";

/** The order button for a deal or sale item, or nothing when it doesn't take orders here. Knows who is looking. */
export async function OrderItem({ promotionId, path }: { promotionId: string; path: string }) {
  const user = await getCurrentUser();
  const status = await orderService.status(promotionId);
  if (!status) return null;

  const canOrder = user?.role === "USER";
  const profile = canOrder && user ? await profileService.get(user.id) : null;

  return (
    <PlaceOrder
      promotionId={promotionId}
      label={status.label}
      price={status.price}
      signedIn={user !== null}
      canOrder={canOrder}
      loginHref={`/login?next=${encodeURIComponent(path)}`}
      defaultName={user?.name ?? ""}
      defaultPhone={profile?.contact.phone ?? ""}
    />
  );
}
