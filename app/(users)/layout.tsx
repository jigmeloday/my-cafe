import { SiteShell } from "@/components/public/site-shell";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}
