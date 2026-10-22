import { StatusBadge } from "@/components/shared/status-badge";
import { ROADMAP_STATUS } from "@/lib/roadmap.constant";
import type { RoadmapItem } from "@/types/roadmap";

/** One upcoming feature: what it is, and how close it is. */
export function RoadmapCard({ item }: { item: RoadmapItem }) {
  const { icon: Icon, title, text, status } = item;
  const { label, tone } = ROADMAP_STATUS[status];

  return (
    <li className="space-y-3 rounded-2xl border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-maroon-soft text-primary">
          <Icon className="size-5" />
        </span>
        <StatusBadge tone={tone}>{label}</StatusBadge>
      </div>
      <h3>{title}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
    </li>
  );
}
