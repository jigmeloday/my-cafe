import Link from "next/link";

import { ABOUT_COPY } from "../constant/about.constant";

/** What keeps Nook fair and safe, in plain words. */
export function AboutTrust() {
  return (
    <section aria-labelledby="trust" className="space-y-6">
      <h2 id="trust">{ABOUT_COPY.trustTitle}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ABOUT_COPY.trust.map(({ icon: Icon, title, text }) => (
          <li key={title} className="space-y-3 rounded-2xl border bg-surface p-5">
            <Icon className="size-6 text-primary" />
            <h3>{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        {ABOUT_COPY.trustNote}{" "}
        <Link href="/terms" className="font-medium text-foreground underline underline-offset-2">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-medium text-foreground underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </section>
  );
}
