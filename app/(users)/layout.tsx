import { SiteShell } from "@/components/public/site-shell";
import { guardArea } from "@/lib/session";

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  await guardArea("customer");

  return <SiteShell>{children}</SiteShell>;
}
