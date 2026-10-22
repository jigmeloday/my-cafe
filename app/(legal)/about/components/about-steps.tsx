import type { AboutStep } from "../model/about.type";

interface AboutStepsProps {
  title: string;
  steps: AboutStep[];
}

/** A short, numbered way through: one card per step. */
export function AboutSteps({ title, steps }: AboutStepsProps) {
  return (
    <div className="space-y-4">
      <h3>{title}</h3>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {steps.map(({ icon: Icon, title: heading, text }, i) => (
          <li key={heading} className="flex gap-4 rounded-2xl border bg-surface p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-maroon-soft text-primary">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="font-semibold">
                <span className="mr-2 text-primary tabular-nums">{i + 1}.</span>
                {heading}
              </p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
