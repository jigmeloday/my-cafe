import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { EMAIL_COPY } from "../constant/email-campaign.constant";

interface FormPageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function FormPageHeader({
  title,
  subtitle,
  backHref = "/business/campaigns",
  backLabel = EMAIL_COPY.back,
}: FormPageHeaderProps) {
  return (
    <header className="space-y-2">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> {backLabel}
      </Link>
      <div className="space-y-1">
        <h1>{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
