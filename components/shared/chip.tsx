import { cn } from "@/lib/utils";

interface ChipProps extends React.ComponentProps<"button"> {
  active?: boolean;
}

export function Chip({ active, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground",
        active && "border-foreground bg-foreground text-background",
        className,
      )}
      {...props}
    />
  );
}
