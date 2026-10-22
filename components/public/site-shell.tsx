import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TrackSite } from "./track-site";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TrackSite />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
