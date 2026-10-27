import { ORDER_RETENTION_DAYS } from "@/lib/constants";

export const MY_ORDERS_COPY = {
  title: "My orders",
  description: `Items you ordered on Nook. The seller contacts you to confirm and to arrange payment and pickup. Your name, phone and note are removed ${ORDER_RETENTION_DAYS} days after an order is finished.`,
  emptyTitle: "No orders yet",
  emptyDescription: "When you order a deal or sale item, it will show here.",
  browse: "Browse deals",
  qty: (n: number) => `Qty ${n}`,
  cancel: "Cancel",
  cancelTitle: "Cancel your order?",
  cancelBody: (title: string) => `Your order for “${title}” will be cancelled. You can order again later.`,
  cancelConfirm: "Cancel order",
  keep: "Keep order",
};
