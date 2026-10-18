import { SiteShell } from "@/components/public/site-shell";
import { guardArea } from "@/lib/session";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Business owners stay in their dashboard; everyone else may browse.
  await guardArea("public");
  return <SiteShell>{children}</SiteShell>;
}
