import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { BusinessShell } from "@/components/business/business-shell";
import { NotFoundView } from "@/components/public/not-found-view";
import { SiteShell } from "@/components/public/site-shell";
import { NO_INDEX } from "@/lib/seo/metadata";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Page not found — Nook", ...NO_INDEX };

/** The page for an address that doesn't exist. Owners and admins see it inside their own area, not the public site. */
export default async function NotFound() {
  const user = await getCurrentUser();

  if (user?.role === "BUSINESS_OWNER") {
    return (
      <BusinessShell>
        <NotFoundView area="business" />
      </BusinessShell>
    );
  }
  if (user?.role === "ADMIN") {
    return (
      <AdminShell>
        <NotFoundView area="admin" />
      </AdminShell>
    );
  }
  return (
    <SiteShell>
      <NotFoundView />
    </SiteShell>
  );
}
