import { cn } from "@/lib/utils";

interface AreaTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export function AreaTabs({ tabs, active, onChange }: AreaTabsProps) {
  return (
    <div role="tablist" className="no-scrollbar flex gap-6 overflow-x-auto border-b">
      {tabs.map((tab) => (
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
