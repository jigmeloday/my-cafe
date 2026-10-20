import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

import { FaqList } from "./components/faq-list";
import { FAQ_TOPICS, HELP_COPY } from "./constant/help.constant";

export const metadata: Metadata = pageMetadata({ title: "Help centre", description: "Answers to common questions about using Nook, for customers and businesses.", path: "/help" });

export default function HelpPage() {
  return (
    <Container className="max-w-3xl space-y-8 py-8 sm:py-12">
      <header className="space-y-3">
        <h1>{HELP_COPY.title}</h1>
        <p className="text-muted-foreground">{HELP_COPY.lead}</p>
        <nav aria-label="Topics" className="flex flex-wrap gap-2 pt-1">
          {FAQ_TOPICS.map((topic) => (
            <a key={topic.id} href={`#${topic.id}`} className="rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
              {topic.title}
            </a>
          ))}
        </nav>
      </header>

      <FaqList />

      <section aria-labelledby="still" className="space-y-3 rounded-2xl bg-muted p-6">
        <h2 id="still">Still need help?</h2>
        <p className="text-muted-foreground">Tell us what is going on and we will get back to you.</p>
        <div className="flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link href="/contact" />}>
            Contact us
          </Button>
          <Button variant="secondary" nativeButton={false} render={<Link href="/report" />}>
            Report an ad
          </Button>
        </div>
      </section>
    </Container>
  );
}
