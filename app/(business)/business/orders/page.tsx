import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { orderService } from "@/services/order/order.service";

import { OrdersTable } from "./components/orders-table";
import { ORDERS_COPY } from "./constant/orders.constant";

export const metadata: Metadata = { title: "Orders — Nook business" };

export default async function OrdersPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const orders = await orderService.forOwner(user.id);

  return (
    <div className="space-y-6">
      <header className="max-w-2xl space-y-1">
        <h1>{ORDERS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{ORDERS_COPY.subtitle}</p>
      </header>
      {orders.length > 0 ? (
        <OrdersTable items={orders} />
      ) : (
        <EmptyState
          title={ORDERS_COPY.emptyTitle}
          description={ORDERS_COPY.emptyDescription}
          action={
            <Button render={<Link href="/business/promotions/new" />}>
              <Plus /> {ORDERS_COPY.emptyAction}
            </Button>
          }
        />
      )}
    </div>
  );
}
