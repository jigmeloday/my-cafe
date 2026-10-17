import { SiteShell } from "@/components/public/site-shell";
import { requireRole } from "@/lib/session";

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  await requireRole("USER", "BUSINESS_OWNER", "ADMIN");

  return <SiteShell>{children}</SiteShell>;
}
