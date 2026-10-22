import { getCurrentUser } from "@/lib/session";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TrackSite } from "./track-site";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  // The header asks the browser who is signed in too, but that answer arrives late. Knowing it here, on the
  // server, means the header is right from the first paint (no "Create account" for someone who is signed in).
  const user = await getCurrentUser();

  return (
    <>
      <TrackSite />
      <SiteHeader user={user ? { name: user.name, role: user.role } : null} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
