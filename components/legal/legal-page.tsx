import Link from "next/link";

import { Container } from "@/components/shared/container";
import { formatDate } from "@/lib/formatters/date";
import { LEGAL } from "@/lib/legal";

import type { LegalDocument } from "@/app/(legal)/constant/legal.type";

interface LegalPageProps {
  document: LegalDocument;
  /** The other policy, linked at the bottom. */
  other: { label: string; href: string };
}

/** A long page of numbered sections with a contents list. Used for the Terms and the Privacy policy. */
export function LegalPage({ document, other }: LegalPageProps) {
  return (
    <Container className="max-w-3xl space-y-8 py-8 sm:py-12">
      <header className="space-y-3">
        <h1>{document.title}</h1>
        <p className="text-sm text-muted-foreground">Last updated {formatDate(LEGAL.updated)}</p>
        <p className="text-muted-foreground">{document.intro}</p>
      </header>

      <nav aria-label="Contents" className="rounded-2xl bg-muted p-5">
        <p className="mb-2 text-sm font-semibold">In this page</p>
        <ol className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {document.sections.map((section, i) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-muted-foreground hover:text-foreground hover:underline">
                {i + 1}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-10">
        {document.sections.map((section, i) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24 space-y-3">
            <h2 id={`${section.id}-title`}>
              {i + 1}. {section.title}
            </h2>
            {section.blocks.map((block, n) =>
              "p" in block ? (
                <p key={n} className="text-muted-foreground">
                  {block.p}
                </p>
              ) : (
                <ul key={n} className="list-disc space-y-1.5 pl-5 text-muted-foreground">
                  {block.ul.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}
      </div>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        Also read our{" "}
        <Link href={other.href} className="font-medium text-foreground underline underline-offset-2">
          {other.label}
        </Link>
        .
      </footer>
    </Container>
  );
}
