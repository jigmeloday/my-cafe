import type { SummaryRow } from "../model/profile.type";

export function DetailsSummary({ rows }: { rows: SummaryRow[] }) {
  return (
    <dl className="grid gap-x-8 sm:grid-cols-2">
      {rows.map(({ label, value }) => (
        <div key={label} className="border-b py-3">
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="truncate text-sm font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
