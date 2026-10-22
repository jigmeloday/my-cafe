import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

import { NOT_FOUND_COPY, NOT_FOUND_LINKS } from "./constant/not-found.constant";
import { NotFoundMark } from "./not-found-mark";

/** The page shown for an address that doesn't exist (or a deal, event or business that has ended or been removed). */
export function NotFoundView() {
  return (
    <Container className="max-w-3xl space-y-10 py-12 text-center sm:py-20">
      <NotFoundMark />
      <div className="mx-auto max-w-xl space-y-3">
        <h1>{NOT_FOUND_COPY.title}</h1>
        <p className="text-lg text-muted-foreground">{NOT_FOUND_COPY.text}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" nativeButton={false} render={<Link href="/" />}>
          {NOT_FOUND_COPY.home}
        </Button>
        <Button size="lg" variant="secondary" nativeButton={false} render={<Link href="/deals" />}>
          {NOT_FOUND_COPY.deals}
        </Button>
      </div>
      <section aria-labelledby="not-found-more" className="space-y-4 text-left">
        <h2 id="not-found-more" className="text-center text-base text-muted-foreground">
          {NOT_FOUND_COPY.moreTitle}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {NOT_FOUND_LINKS.map(({ icon: Icon, label, text, href }) => (
            <li key={href}>
              <Link href={href} className="flex items-center gap-4 rounded-2xl border bg-surface p-4 transition-shadow hover:shadow-md">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-maroon-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{label}</span>
                  <span className="block text-sm text-muted-foreground">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
