import { ORDERABLE_TYPES } from "@/lib/constants";

/** Whether a promotion of this type can have a price and take orders (a deal or a sale item). */
export const canOrder = (type: string) => (ORDERABLE_TYPES as readonly string[]).includes(type);

/** The first message in a WhatsApp order chat, so the seller knows what is wanted without asking. */
export const orderMessage = (title: string, site: string, price?: string) =>
  `Hi! I'd like to order "${title}"${price ? ` (${price})` : ""} that I saw on ${site}.`;

export const ORDER_STATUS_LABELS = {
  PLACED: "New",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

/** The badge colour for each state of an order. */
export const ORDER_STATUS_TONES = {
  PLACED: "warning",
  CONFIRMED: "info",
  COMPLETED: "success",
  CANCELLED: "neutral",
} as const;
