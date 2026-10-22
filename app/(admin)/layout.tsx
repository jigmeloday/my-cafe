import type { Metadata } from "next";

import { NO_INDEX } from "@/lib/seo/metadata";
import { AdminShell } from "@/components/admin/admin-shell";
import { guardArea } from "@/lib/session";


// Accounts and dashboards are private, so search engines are asked to leave them out.
export const metadata: Metadata = NO_INDEX;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardArea("admin");

  return <AdminShell>{children}</AdminShell>;
}
