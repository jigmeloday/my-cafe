import Link from "next/link";

import { SectionCard } from "@/components/business/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { roadmapFor } from "@/lib/roadmap";
import { ROADMAP_COPY, ROADMAP_STATUS } from "@/lib/roadmap.constant";

/** What's on the way for businesses, with a link to the full list. Left out when nothing is planned. */
export function ComingSoonCard() {
  const items = roadmapFor("businesses");
  if (items.length === 0) return null;

  return (
    <SectionCard title="Coming soon for your business" description="New things we're building. Tell us what would help you most.">
      <ul className="divide-y">
        {items.map(({ id, icon: Icon, title, text, status }) => (
          <li key={id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
            <StatusBadge tone={ROADMAP_STATUS[status].tone}>{ROADMAP_STATUS[status].label}</StatusBadge>
          </li>
        ))}
      </ul>
      <Link href={ROADMAP_COPY.page} className="text-sm font-semibold text-primary hover:underline">
        {ROADMAP_COPY.seeAll}
      </Link>
    </SectionCard>
  );
}
