import Link from "next/link";

import { SectionCard } from "@/components/business/section-card";
import { cn } from "@/lib/utils";

import { DASHBOARD_COPY } from "../constant/dashboard.constant";
import { attentionItems } from "../utils/dashboard.utils";

export function AttentionCard() {
  const items = attentionItems();
  const nothing = items.every((item) => item.count === 0);

  return (
    <SectionCard title={DASHBOARD_COPY.attentionTitle}>
      {nothing ? (
        <p className="text-sm text-muted-foreground">
          {DASHBOARD_COPY.attentionClear}
        </p>
      ) : (
        <ul className="divide-y">
          {items.map(({ id, label, count, href }) => (
            <li key={id}>
              <Link
                href={href}
                className="flex items-center justify-between gap-4 py-3 text-sm hover:text-primary"
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "min-w-8 rounded-full px-2.5 py-0.5 text-center text-xs font-semibold tabular-nums",
                    count > 0
                      ? "bg-gold/20 text-[#8a6212]"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
