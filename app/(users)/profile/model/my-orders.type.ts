import type { ORDER_STATUS_LABELS } from "@/lib/orders";

export interface MyOrder {
  id: string;
  title: string;
  businessName: string;
  href: string;
  quantity: number;
  /** "Nu. 500", or empty when the item had no price. */
  total: string;
  /** The day it was placed, "YYYY-MM-DD". */
  placedOn: string;
  status: keyof typeof ORDER_STATUS_LABELS;
}
