import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PROMOTIONS_COPY } from "../constant/promotion.constant";

interface FormPageHeaderProps {
  title: string;
  subtitle: string;
}

export function FormPageHeader({ title, subtitle }: FormPageHeaderProps) {
  return (
    <header className="space-y-2">
      <Link
        href="/business/promotions"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> {PROMOTIONS_COPY.back}
      </Link>
      <div className="space-y-1">
        <h1>{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </header>
  );
}
