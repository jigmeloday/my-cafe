import { ORDER_RETENTION_DAYS } from "@/lib/constants";

export const ORDERS_COPY = {
  title: "Orders",
  subtitle: `Orders customers placed on Nook. Confirm an order, then arrange payment and pickup or delivery with them. Nook doesn't take payment. Names, phone numbers and notes are removed ${ORDER_RETENTION_DAYS} days after an order is completed or cancelled.`,
  emptyTitle: "No orders yet",
  emptyDescription: "When you set a deal or sale item to take orders on Nook, the orders will show here.",
  emptyAction: "Create promotion",
  removed: "Removed",
  confirm: "Confirm",
  complete: "Mark completed",
  cancel: "Cancel",
  cancelTitle: "Cancel this order?",
  cancelBody: (item: string, customer: string) => `${customer ? `${customer}'s` : "The"} order for “${item}” will be marked as cancelled.`,
  cancelConfirm: "Cancel order",
  keep: "Keep order",
};

export const ORDER_HEADERS = ["Item", "Customer", "Phone", "Qty", "Total", "Placed", "Status", ""] as const;
