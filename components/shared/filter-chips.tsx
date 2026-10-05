import { cn } from "@/lib/utils";

import { Chip } from "./chip";

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
        <Chip key={id} active={id === active} onClick={() => onChange(id)}>
          {label}
        </Chip>
      ))}
    </div>
  );
}
