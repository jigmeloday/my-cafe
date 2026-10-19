import type { AboutStep } from "../constant/about.constant";

interface AboutStepsProps {
  id: string;
  title: string;
  steps: AboutStep[];
}

/** A heading and a row of short, icon-led points. */
export function AboutSteps({ id, title, steps }: AboutStepsProps) {
  return (
    <section aria-labelledby={id} className="space-y-5">
      <h2 id={id}>{title}</h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title: heading, text }) => (
          <li key={heading} className="space-y-3 rounded-2xl border bg-surface p-5">
            <span className="grid size-10 place-items-center rounded-full bg-maroon-soft text-primary">
              <Icon className="size-5" />
            </span>
            <h3>{heading}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
