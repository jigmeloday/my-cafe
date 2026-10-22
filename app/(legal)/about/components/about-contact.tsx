import { LEGAL } from "@/lib/legal";

import { ABOUT_COPY } from "../constant/about.constant";

export function AboutContact() {
  return (
    <section aria-labelledby="contact" className="space-y-2 text-sm text-muted-foreground">
      <h2 id="contact" className="text-base text-foreground">
        {ABOUT_COPY.contactTitle}
      </h2>
      <p>
        {LEGAL.company}, {LEGAL.address}
        <br />
        {LEGAL.contactEmail}
      </p>
    </section>
  );
}
