import { cn } from "@/lib/utils";

interface FilterChipsProps<T extends string> {
  options: readonly { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
}

export function FilterChips<T extends string>({
  options,
  active,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div className={cn("no-scrollbar flex gap-2 overflow-x-auto", className)}>
      {options.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={id === active}
          onClick={() => onChange(id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground",
            id === active && "border-foreground bg-foreground text-background",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
