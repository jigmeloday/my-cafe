import type { Metadata } from "next";

import { NO_INDEX } from "@/lib/seo/metadata";
import { BusinessShell } from "@/components/business/business-shell";
import { guardArea } from "@/lib/session";


// Accounts and dashboards are private, so search engines are asked to leave them out.
export const metadata: Metadata = NO_INDEX;

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardArea("business");

  return <BusinessShell>{children}</BusinessShell>;
}
