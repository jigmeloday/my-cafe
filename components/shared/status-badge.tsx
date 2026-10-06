import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

const TONES: Record<StatusTone, { badge: string; dot: string }> = {
  success: { badge: "bg-success/10 text-success", dot: "bg-success" },
  warning: { badge: "bg-gold/15 text-[#8a6212]", dot: "bg-gold" },
  danger: {
    badge: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  info: { badge: "bg-maroon-soft text-primary", dot: "bg-primary" },
  neutral: {
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  const { badge, dot } = TONES[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        badge,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />
      {children}
    </span>
  );
}
