import type { Metadata } from "next";

import { formatMoney } from "@/lib/formatters/currency";
import { requireRole } from "@/lib/session";
import { orderService } from "@/services/order/order.service";

import { MyOrders } from "../components/my-orders";
import { ProfileSection } from "../components/profile-section";
import { MY_ORDERS_COPY } from "../constant/my-orders.constant";
import type { MyOrder } from "../model/my-orders.type";

export const metadata: Metadata = { title: "My orders — Nook" };

export default async function MyOrdersPage() {
  // The layout checks this too, but a page must not rely on that.
  const user = await requireRole("USER", "ADMIN");
  const rows = await orderService.mine(user.id);

  const orders: MyOrder[] = rows.map((o) => ({
    id: o.id,
    title: o.promotion.title,
    businessName: o.promotion.business.name,
    href: `/promotions/${o.promotion.slug}`,
    quantity: o.quantity,
    total: o.unitPrice === null ? "" : formatMoney(o.unitPrice * o.quantity),
    placedOn: o.createdAt.toISOString().slice(0, 10),
    status: o.status,
  }));

  return (
    <ProfileSection id="orders" title={MY_ORDERS_COPY.title} description={MY_ORDERS_COPY.description}>
      <MyOrders orders={orders} />
    </ProfileSection>
  );
}
