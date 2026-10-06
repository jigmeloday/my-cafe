import { OVERVIEW_COPY } from "../constant/profile.constant";

export function CompletionCard({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border px-4 py-3">
      <p className="shrink-0 text-sm font-medium">
        {OVERVIEW_COPY.completionTitle}
      </p>
      <div
        role="progressbar"
        aria-label={OVERVIEW_COPY.completionTitle}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-sm text-muted-foreground">{percent}%</span>
    </div>
  );
}
