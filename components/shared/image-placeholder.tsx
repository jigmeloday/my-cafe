import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  label = "Photo",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center bg-muted text-xs text-muted-foreground",
        className,
      )}
    >
      [{label}]
    </div>
  );
}
