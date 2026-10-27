import { APP_NAME, BRAND, button, escapeHtml, greeting, layout, note, type EmailContent } from "./templates";

const site = () => process.env.BETTER_AUTH_URL ?? "";

/** One "label: value" line, left out when there is no value. */
const line = (label: string, value?: string | null) =>
  value ? `<p style="margin:0 0 6px;font-size:15px"><span style="color:${BRAND.muted}">${escapeHtml(label)}:</span> <strong>${escapeHtml(value)}</strong></p>` : "";

export interface OrderEmailInput {
  /** The seller's name (the business owner). */
  ownerName: string;
  item: string;
  quantity: number;
  /** "Nu. 500", or empty when the item has no price. */
  total: string;
  customerName: string;
  phone: string;
  note: string;
}

/** Tells the seller a customer ordered on Nook, with what they need to get in touch. */
export function orderReceivedEmail(input: OrderEmailInput): EmailContent {
  const { ownerName, item, quantity, total, customerName, phone, note: customerNote } = input;
  const url = `${site()}/business/orders`;
  const facts = [["Item", item], ["How many", String(quantity)], ["Total", total], ["Customer", customerName], ["Phone", phone], ["Note", customerNote]] as const;

  return {
    subject: `New order: ${item}`,
    text: `Hi ${ownerName},\n\n${customerName} ordered ${item} on ${APP_NAME}.\n\n${facts.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nConfirm it, and arrange payment and pickup with the customer: ${url}`,
    html: layout(
      "New order",
      `${greeting(ownerName)}
       <p style="margin:0 0 16px"><strong>${escapeHtml(customerName)}</strong> ordered <strong>${escapeHtml(item)}</strong> on ${APP_NAME}.</p>
       <div style="padding:14px 16px;background:${BRAND.maroonSoft};border-radius:12px">${facts.map(([k, v]) => line(k, v)).join("")}</div>
       ${button(url, "See the order")}
       ${note("Confirm the order, then arrange payment and pickup or delivery with the customer. Nook doesn't take payment.")}`,
      `${customerName} ordered ${item}.`,
    ),
  };
}
