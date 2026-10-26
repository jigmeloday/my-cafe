import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/formatters/date";
import { eventWindow } from "@/lib/event-dates";
import { formatNumber } from "@/lib/formatters/number";
import type { registrationService } from "@/services/registration/registration.service";

import { REGISTRATIONS_COPY } from "../constant/registrations.constant";

type EventRow = Awaited<ReturnType<typeof registrationService.eventsWithCounts>>[number];

const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : null);

/** The business's events that take reservations, each with how many seats are taken. */
export function EventsTable({ items }: { items: EventRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {["Event", "When", "Coming", ""].map((h, i) => (
              <th key={h || i} className={`px-4 py-3 font-medium ${i === 2 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {items.map((e) => (
            <tr key={e.id}>
              <td className="px-4 py-3">
                <p className="font-medium">{e.title}</p>
                {!e.registrationEnabled && <StatusBadge tone="neutral">{REGISTRATIONS_COPY.closed}</StatusBadge>}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{[iso(eventWindow(e).start), iso(eventWindow(e).end)].filter(Boolean).filter((d, i, all) => all.indexOf(d) === i).map((d) => formatDate(d!)).join(" – ") || "—"}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <span className="font-semibold">{formatNumber(e.registered)}</span>
                <span className="text-muted-foreground"> / {e.capacity === null ? REGISTRATIONS_COPY.unlimited : formatNumber(e.capacity)}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/business/registrations/${e.id}`} className="font-semibold text-primary hover:underline">
                  Open guest list
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
