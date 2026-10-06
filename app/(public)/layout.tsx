import { SiteShell } from "@/components/public/site-shell";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
