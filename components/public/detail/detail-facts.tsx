import type { DetailFact } from "../model/detail.type";

export function DetailFacts({ facts }: { facts: DetailFact[] }) {
  return (
    <dl className="grid gap-x-8 gap-y-5 border-y py-6 sm:grid-cols-2">
      {facts.map(({ label, value }) => (
        <div key={label} className="space-y-0.5">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
