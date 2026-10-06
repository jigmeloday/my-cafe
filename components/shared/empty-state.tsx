import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl bg-muted px-6 py-16 text-center",
        className,
      )}
    >
      <h3>{title}</h3>
      {description && (
        <p className="max-w-sm text-muted-foreground">{description}</p>
      )}
      {action}
    </div>
  );
}
