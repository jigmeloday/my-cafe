import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { REPORT_REASONS } from "@/lib/report-reasons";

export const metadata: Metadata = { title: "Report an ad — Nook" };

export default function ReportHelpPage() {
  return (
    <Container className="max-w-2xl space-y-6 py-8 sm:py-10">
      <header className="space-y-2">
        <h1>Report an ad</h1>
        <p className="text-muted-foreground">If a promotion, event or sponsored banner looks wrong, tell us. We review every report.</p>
      </header>
      <section className="space-y-2">
        <h2>How to report</h2>
        <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
          <li>Open the promotion or event, or find the banner at the top of the home page.</li>
          <li>Press <strong className="text-foreground">Report</strong> (on a banner it says “Report ad”).</li>
          <li>Choose what is wrong and add a note if you like. You need to be logged in, so reports come from real people.</li>
        </ol>
      </section>
      <section className="space-y-2">
        <h2>What you can report</h2>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          {REPORT_REASONS.map((r) => (
            <li key={r.id}>{r.label}</li>
          ))}
        </ul>
      </section>
      <section className="space-y-2">
        <h2>What happens next</h2>
        <p className="text-muted-foreground">An admin looks at the ad. They can dismiss the report, warn the business, or take the ad down. The business is never told who reported it.</p>
      </section>
      <Button render={<Link href="/deals" />}>Browse deals</Button>
    </Container>
  );
}
