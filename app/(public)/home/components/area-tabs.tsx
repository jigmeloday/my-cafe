import { cn } from "@/lib/utils";

import { AREA_TABS } from "../constant/areas.constant";
import type { AreaTab } from "../model/home.type";

interface AreaTabsProps {
  active: AreaTab;
  onChange: (tab: AreaTab) => void;
}

export function AreaTabs({ active, onChange }: AreaTabsProps) {
  return (
    <div
      role="tablist"
      className="no-scrollbar flex gap-6 overflow-x-auto border-b"
    >
      {AREA_TABS.map((tab) => (
        <button
          key={tab}
          role="tab"
          type="button"
          aria-selected={tab === active}
          onClick={() => onChange(tab)}
          className={cn(
            "-mb-px shrink-0 border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
            tab === active && "border-foreground text-foreground",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
