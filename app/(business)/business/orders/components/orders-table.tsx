"use client";

import { useState } from "react";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/formatters/date";
import { formatMoney } from "@/lib/formatters/currency";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from "@/lib/orders";
import type { ActionResult } from "@/server/actions/action.type";

import { ORDER_HEADERS, ORDERS_COPY as COPY } from "../constant/orders.constant";
import { OrderActions } from "./order-actions";

interface OrderRow {
  id: string;
  name: string;
  phone: string;
  quantity: number;
  note: string;
  unitPrice: number | null;
  status: keyof typeof ORDER_STATUS_LABELS;
  createdAt: Date;
  promotion: { title: string };
}

/** Bhutan time, as the rest of the dashboard shows it. */
const bhutan = (d: Date) => new Date(d.getTime() + 6 * 3_600_000).toISOString().slice(0, 16);

/** Every order, newest first: who ordered what, how to reach them, and what to do next. */
export function OrdersTable({ items }: { items: OrderRow[] }) {
  const [notice, setNotice] = useState<ActionResult | null>(null);

  return (
    <div className="space-y-3">
      {notice && !notice.ok && <p role="alert" className="text-sm text-destructive">{notice.error}</p>}
      <div className="overflow-x-auto rounded-xl border bg-surface">
        <table className="w-full min-w-[56rem] text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b">
              {ORDER_HEADERS.map((h, i) => (
                <th key={i} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y tabular-nums">
            {items.map((o) => (
              <tr key={o.id} className="align-top">
                <td className="px-4 py-3 font-medium">{o.promotion.title}</td>
                <td className="px-4 py-3">
                  {o.name || <span className="text-muted-foreground">{COPY.removed}</span>}
                  {o.note && <p className="mt-0.5 max-w-56 text-xs font-normal text-muted-foreground">“{o.note}”</p>}
                </td>
                <td className="px-4 py-3">
                  {o.phone ? <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="hover:underline">{o.phone}</a> : <span className="text-muted-foreground">{COPY.removed}</span>}
                </td>
                <td className="px-4 py-3">{o.quantity}</td>
                <td className="px-4 py-3">{o.unitPrice === null ? "—" : formatMoney(o.unitPrice * o.quantity)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDateTime(bhutan(o.createdAt))}</td>
                <td className="px-4 py-3"><StatusBadge tone={ORDER_STATUS_TONES[o.status]}>{ORDER_STATUS_LABELS[o.status]}</StatusBadge></td>
                <td className="px-4 py-3">
                  <OrderActions id={o.id} status={o.status} item={o.promotion.title} customer={o.name} onResult={setNotice} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
