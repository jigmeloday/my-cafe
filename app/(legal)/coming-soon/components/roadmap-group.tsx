import { RoadmapCard } from "@/components/shared/roadmap-card";
import { roadmapFor } from "@/lib/roadmap";
import { ROADMAP_AUDIENCES } from "@/lib/roadmap.constant";
import type { RoadmapAudience } from "@/types/roadmap";

/** The features on the way for one kind of visitor. */
export function RoadmapGroup({ audience }: { audience: RoadmapAudience }) {
  const { title, text } = ROADMAP_AUDIENCES[audience];
  const items = roadmapFor(audience);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={`roadmap-${audience}`} className="space-y-4">
      <div className="space-y-1">
        <h2 id={`roadmap-${audience}`}>{title}</h2>
        <p className="text-muted-foreground">{text}</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <RoadmapCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
