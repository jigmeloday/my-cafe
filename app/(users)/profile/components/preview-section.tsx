import Link from "next/link";

import { OVERVIEW_COPY } from "../constant/profile.constant";

interface PreviewSectionProps {
  id: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}

export function PreviewSection({
  id,
  title,
  description,
  href,
  linkLabel,
  children,
}: PreviewSectionProps) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 id={id}>{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="shrink-0 text-sm font-semibold text-primary hover:underline"
          >
            {linkLabel ?? OVERVIEW_COPY.viewAll}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
