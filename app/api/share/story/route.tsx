import { ImageResponse } from "next/og";

import { getBusinessProfile } from "@/app/(public)/businesses/utils/business.server";
import { storyPhoto } from "@/lib/share-image";
import { SEO, siteUrl } from "@/lib/seo/site";
import { discoveryService } from "@/services/discovery/discovery.service";

const SIZE = { width: 1080, height: 1920 };

interface Story {
  photo?: string;
  badge?: string;
  title: string;
  line: string;
  path: string;
}

async function storyFor(type: string | null, slug: string): Promise<Story | null> {
  if (type === "business") {
    const b = await getBusinessProfile(slug);
    return b && { photo: b.coverUrl ?? b.logoUrl, badge: b.badge, title: b.name, line: b.tagline || b.area, path: `/businesses/${slug}` };
  }
  const d = type === "promotion" ? await discoveryService.promotionDetail(slug) : null;
  if (!d) return null;
  return {
    photo: d.photos?.[0] ?? d.shopLogo,
    badge: d.badge ?? d.highlight,
    title: d.title,
    line: [d.shop.name, d.shop.area].filter(Boolean).join(" · "),
    path: `/${d.kind === "event" ? "events" : "promotions"}/${d.slug}`,
  };
}

/** A story-sized picture (for Instagram, TikTok or Facebook stories) of a deal, event or business. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const story = slug ? await storyFor(searchParams.get("type"), slug) : null;
  if (!story) return new Response("Not found", { status: 404 });

  const photo = await storyPhoto(story.photo);
  const host = new URL(siteUrl()).host;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#7f1d3a", color: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo && <img src={photo} alt="" width={1080} height={1920} style={{ position: "absolute", inset: 0 }} />}
        <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1920, display: "flex", background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.9) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1920, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>{SEO.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {story.badge && (
              <div style={{ display: "flex", alignSelf: "flex-start", background: "#f6e9d8", color: "#7f1d3a", fontSize: 40, fontWeight: 700, padding: "12px 32px", borderRadius: 999 }}>{story.badge}</div>
            )}
            <div style={{ display: "flex", fontSize: 108, fontWeight: 800, lineHeight: 1.05 }}>{story.title}</div>
            {story.line && <div style={{ display: "flex", fontSize: 48, color: "#f6e9d8" }}>{story.line}</div>}
            <div style={{ display: "flex", marginTop: 40, fontSize: 40, opacity: 0.9 }}>{`${host}${story.path}`}</div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE, headers: { "Content-Disposition": `attachment; filename="${slug}-story.png"`, "Cache-Control": "public, max-age=300" } },
  );
}
