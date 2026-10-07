import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  /** Change vs the previous period as a ratio (0.12 = +12%). */
  delta?: number;
  /** Set when a decrease is good news (e.g. cost per click). */
  lowerIsBetter?: boolean;
  hint?: string;
}

export function StatCard({
  label,
  value,
  delta,
  lowerIsBetter,
  hint,
}: StatCardProps) {
  const up = (delta ?? 0) >= 0;
  const good = lowerIsBetter ? !up : up;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="rounded-xl border bg-surface p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold",
              good ? "text-success" : "text-destructive",
            )}
          >
            <Arrow className="size-3.5" />
            {Math.abs(delta * 100).toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
