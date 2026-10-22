import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ABOUT_COPY } from "../constant/about.constant";

/** The three things Nook is for, each one a way in. */
export function AboutPillars() {
  return (
    <section aria-labelledby="pillars" className="space-y-6">
      <h2 id="pillars">{ABOUT_COPY.pillarsTitle}</h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {ABOUT_COPY.pillars.map(({ icon: Icon, title, text, href, cta }) => (
          <li key={title}>
            <Link href={href} className="group flex h-full flex-col gap-4 rounded-3xl border bg-surface p-6 transition-shadow hover:shadow-md">
              <span className="grid size-12 place-items-center rounded-2xl bg-maroon-soft text-primary">
                <Icon className="size-6" />
              </span>
              <div className="flex-1 space-y-2">
                <h3>{title}</h3>
                <p className="text-muted-foreground">{text}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
