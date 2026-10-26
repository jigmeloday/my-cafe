import { formatDateTime } from "@/lib/formatters/date";

import { ATTENDEE_HEADERS, REMOVED_NAME } from "../constant/registrations.constant";

interface Attendee {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
}

/** Bhutan time, as the rest of the dashboard shows it. */
const bhutan = (d: Date) => new Date(d.getTime() + 6 * 3_600_000).toISOString().slice(0, 16);

/** Who has a seat: name, phone (a tap-to-call link) and when they signed up. */
export function AttendeesTable({ items }: { items: Attendee[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[34rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {ATTENDEE_HEADERS.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {items.map((a, i) => (
            <tr key={a.id}>
              <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3 font-medium">{a.name || <span className="font-normal text-muted-foreground">{REMOVED_NAME}</span>}</td>
              <td className="px-4 py-3">
                {a.phone ? (
                  <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="hover:underline">
                    {a.phone}
                  </a>
                ) : (
                  <span className="text-muted-foreground">{a.name ? "Not shared" : "Removed"}</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{formatDateTime(bhutan(a.createdAt))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
