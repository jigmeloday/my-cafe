import { ImageResponse } from "next/og";

import { SEO } from "@/lib/seo/site";

export const alt = `${SEO.name} — ${SEO.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The picture shown when a link to Nook is shared and the page has no photo of its own. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#7f1d3a", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: 96 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div style={{ fontSize: 120, fontWeight: 700 }}>{SEO.name}</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 48, color: "#f6e9d8" }}>{SEO.tagline}</div>
        <div style={{ marginTop: 16, fontSize: 32, color: "#f6e9d8", opacity: 0.85 }}>Deals, events and new places in Bhutan</div>
      </div>
    ),
    size,
  );
}
