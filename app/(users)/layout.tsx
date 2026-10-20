import type { Metadata } from "next";

import { NO_INDEX } from "@/lib/seo/metadata";
import { SiteShell } from "@/components/public/site-shell";
import { guardArea } from "@/lib/session";


// Accounts and dashboards are private, so search engines are asked to leave them out.
export const metadata: Metadata = NO_INDEX;

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  await guardArea("customer");

  return <SiteShell>{children}</SiteShell>;
}
