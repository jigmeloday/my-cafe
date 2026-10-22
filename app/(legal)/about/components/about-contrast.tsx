import { Check, X } from "lucide-react";

import { ABOUT_COPY } from "../constant/about.constant";

const { before, after } = ABOUT_COPY;

/** Why Nook exists: how finding things is now, next to how it is with Nook. */
export function AboutContrast() {
  return (
    <section aria-labelledby="why" className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <h2 id="why">{ABOUT_COPY.whyTitle}</h2>
        <p className="text-lg text-muted-foreground">{ABOUT_COPY.whyLead}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl bg-muted p-6">
          <h3 className="text-muted-foreground">{before.title}</h3>
          <ul className="space-y-3">
            {before.points.map((point) => (
              <li key={point} className="flex gap-3 text-muted-foreground">
                <X aria-hidden className="mt-0.5 size-5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 rounded-3xl bg-maroon-soft p-6">
          <h3 className="text-primary">{after.title}</h3>
          <ul className="space-y-3">
            {after.points.map((point) => (
              <li key={point} className="flex gap-3">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
