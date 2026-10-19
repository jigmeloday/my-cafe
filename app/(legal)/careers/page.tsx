import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";

import { RoleCard } from "./components/role-card";
import { CAREERS_COPY, OPEN_ROLES } from "./constant/careers.constant";

export const metadata: Metadata = {
  title: "Careers — kuzu",
  description: "Help us build the easiest way to find what's on in Bhutan.",
};

const canEmail = !LEGAL.contactEmail.startsWith("[");

export default function CareersPage() {
  return (
    <Container className="max-w-4xl space-y-14 py-8 sm:py-12">
      <header className="max-w-2xl space-y-4">
        <h1>{CAREERS_COPY.title}</h1>
        <p className="text-lg text-muted-foreground">{CAREERS_COPY.lead}</p>
      </header>

      <section aria-labelledby="how-we-work" className="space-y-5">
        <h2 id="how-we-work">{CAREERS_COPY.whyTitle}</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {CAREERS_COPY.values.map(({ icon: Icon, title, text }) => (
            <li key={title} className="space-y-3 rounded-2xl border bg-surface p-5">
              <span className="grid size-10 place-items-center rounded-full bg-maroon-soft text-primary">
                <Icon className="size-5" />
              </span>
              <h3>{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="open-roles" className="space-y-5">
        <h2 id="open-roles">{CAREERS_COPY.rolesTitle}</h2>
        {OPEN_ROLES.length > 0 ? (
          <div className="space-y-4">
            {OPEN_ROLES.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl bg-muted p-6">
            <h3>{CAREERS_COPY.noRolesTitle}</h3>
            <p className="max-w-2xl text-muted-foreground">{CAREERS_COPY.noRolesText}</p>
            {canEmail ? (
              <Button nativeButton={false} render={<a href={`mailto:${LEGAL.contactEmail}?subject=${encodeURIComponent("Hello from a future colleague")}`} />}>
                Email us
              </Button>
            ) : (
              <p className="text-sm font-medium">{LEGAL.contactEmail}</p>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="how-hiring" className="space-y-4">
        <h2 id="how-hiring">{CAREERS_COPY.howTitle}</h2>
        <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
          {CAREERS_COPY.how.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground">
          {CAREERS_COPY.privacy}{" "}
          <Link href="/privacy" className="font-medium text-foreground underline underline-offset-2">
            Read our privacy policy
          </Link>
          .
        </p>
      </section>
    </Container>
  );
}
