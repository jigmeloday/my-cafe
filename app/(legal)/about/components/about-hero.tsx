import Link from "next/link";

import { formatNumber } from "@/lib/formatters/number";
import { Button } from "@/components/ui/button";

import { ABOUT_COPY } from "../constant/about.constant";
import type { AboutTile } from "../model/about.type";

/** The first thing people see: what Nook is, in one line, with the live numbers beside it. */
export function AboutHero({ tiles }: { tiles: AboutTile[] }) {
  return (
    <section aria-labelledby="about-title" className="overflow-hidden rounded-3xl bg-primary text-primary-foreground">
      <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14 lg:p-14">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <span aria-hidden className="size-2 rounded-full bg-gold" />
            {ABOUT_COPY.eyebrow}
          </p>
          <h1 id="about-title" className="text-primary-foreground">
            {ABOUT_COPY.title}
          </h1>
          <p className="max-w-xl text-lg text-primary-foreground/85">{ABOUT_COPY.lead}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="lg" nativeButton={false} render={<Link href="/deals" />}>
              {ABOUT_COPY.browse}
            </Button>
            <Button size="lg" className="bg-maroon-dark hover:bg-maroon-dark/80" nativeButton={false} render={<Link href="/register" />}>
              {ABOUT_COPY.list}
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/75">{ABOUT_COPY.note}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {tiles.map(({ icon: Icon, label, value, text }) => (
            <li key={label} className="flex items-center gap-4 rounded-2xl bg-primary-foreground/10 p-4 sm:flex-col sm:items-start lg:flex-row lg:items-center lg:p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-foreground/15">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-semibold tabular-nums">
                  {value !== undefined && `${formatNumber(value)} `}
                  <span className={value !== undefined ? "text-base font-medium" : undefined}>{label}</span>
                </p>
                <p className="text-sm text-primary-foreground/75">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
