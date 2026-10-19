import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { Container } from "@/components/shared/container";
import { LEGAL } from "@/lib/legal";

import { ContactForm } from "./components/contact-form";
import { CONTACT_COPY } from "./constant/contact.constant";

export const metadata: Metadata = {
  title: "Contact us — kuzu",
  description: "Get in touch with the kuzu team.",
};

/** The address is a placeholder until the company fills it in: then show it as text, not a broken link. */
const canEmail = !LEGAL.contactEmail.startsWith("[");

export default function ContactPage() {
  return (
    <Container className="max-w-5xl space-y-10 py-8 sm:py-12">
      <header className="max-w-2xl space-y-3">
        <h1>{CONTACT_COPY.title}</h1>
        <p className="text-muted-foreground">{CONTACT_COPY.lead}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <section aria-labelledby="form" className="relative space-y-4">
          <h2 id="form">{CONTACT_COPY.formTitle}</h2>
          <ContactForm />
        </section>

        <aside aria-labelledby="details" className="space-y-5 self-start rounded-2xl bg-muted p-6">
          <h2 id="details" className="text-xl">
            {CONTACT_COPY.directTitle}
          </h2>
          <p className="flex items-start gap-3 text-sm">
            <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              <span className="block font-medium">Email</span>
              {canEmail ? (
                <a href={`mailto:${LEGAL.contactEmail}`} className="text-muted-foreground underline underline-offset-2 hover:text-foreground">
                  {LEGAL.contactEmail}
                </a>
              ) : (
                <span className="text-muted-foreground">{LEGAL.contactEmail}</span>
              )}
            </span>
          </p>
          <p className="flex items-start gap-3 text-sm">
            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
            <span>
              <span className="block font-medium">{LEGAL.company}</span>
              <span className="text-muted-foreground">{LEGAL.address}</span>
            </span>
          </p>
          <p className="text-sm text-muted-foreground">{CONTACT_COPY.reply}</p>
          <p className="border-t pt-4 text-sm text-muted-foreground">
            Looking for a quick answer? Try the{" "}
            <Link href="/help" className="font-medium text-foreground underline underline-offset-2">
              help centre
            </Link>
            . To report a misleading ad, use the{" "}
            <Link href="/report" className="font-medium text-foreground underline underline-offset-2">
              Report button
            </Link>
            .
          </p>
        </aside>
      </div>
    </Container>
  );
}
