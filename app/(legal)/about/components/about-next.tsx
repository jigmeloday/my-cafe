import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RoadmapCard } from "@/components/shared/roadmap-card";
import { roadmapNext } from "@/lib/roadmap";
import { ROADMAP_COPY } from "@/lib/roadmap.constant";

const SHOWN = 3;

/** A short look at what's coming, with a way to the full list. */
export function AboutNext() {
  return (
    <section aria-labelledby="about-next" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="about-next">{ROADMAP_COPY.nextTitle}</h2>
        <Link href={ROADMAP_COPY.page} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          {ROADMAP_COPY.seeAll}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {roadmapNext(SHOWN).map((item) => (
          <RoadmapCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
