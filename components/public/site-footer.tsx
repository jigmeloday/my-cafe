import Link from "next/link";

import { Container } from "@/components/shared/container";

import {
  FOOTER_COLUMNS,
  SITE_CURRENCY,
  SITE_LOCALE,
  SITE_NAME,
} from "./constant/site.constant";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/60">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map(({ title, links }) => (
            <div key={title} className="space-y-3">
              <h6>{title}</h6>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover:text-foreground hover:underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p className="font-medium text-foreground">
            {SITE_LOCALE} · {SITE_CURRENCY}
          </p>
        </div>
      </Container>
    </footer>
  );
}
