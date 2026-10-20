import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { formatDateTime } from "@/lib/formatters/date";

export interface Notice {
  id: string;
  title: string;
  description: string;
  href: string | null;
  /** "YYYY-MM-DDTHH:mm" */
  at: string;
}

/** Messages from Nook about the business's ads (warnings, removals). Shows nothing when there are none. */
export function NoticesCard({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) return null;

  return (
    <section aria-labelledby="notices" className="space-y-3 rounded-xl border border-gold/40 bg-gold/10 p-4 sm:p-5">
      <h2 id="notices" className="flex items-center gap-2">
        <TriangleAlert className="size-5 text-[#8a6212]" /> Messages from Nook
      </h2>
      <ul className="divide-y divide-gold/30">
        {notices.map((n) => (
          <li key={n.id} className="space-y-0.5 py-2 first:pt-0 last:pb-0">
            <p className="text-sm font-semibold">
              {n.href ? (
                <Link href={n.href} className="hover:underline">
                  {n.title}
                </Link>
              ) : (
                n.title
              )}
            </p>
            <p className="text-sm text-muted-foreground">{n.description}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(n.at)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
