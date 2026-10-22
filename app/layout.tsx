import type { Metadata, Viewport } from "next";
import { Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { SessionSync } from "@/components/auth/session-sync";
import { EngagementProvider } from "@/components/engagement/engagement-provider";
import { SEO, siteUrl } from "@/lib/seo/site";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: `${SEO.name} — ${SEO.tagline}`,
  description: SEO.description,
  applicationName: SEO.name,
  keywords: ["Bhutan", "deals in Bhutan", "events in Bhutan", "Thimphu", "local businesses", "new places", "things to do in Bhutan"],
  alternates: { canonical: "./" },
  openGraph: { type: "website", siteName: SEO.name, locale: "en_US", title: `${SEO.name} — ${SEO.tagline}`, description: SEO.description, images: [SEO.defaultImage] },
  twitter: { card: "summary_large_image", title: `${SEO.name} — ${SEO.tagline}`, description: SEO.description, images: [SEO.defaultImage] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: SEO.themeColor };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionSync />
        <EngagementProvider>{children}</EngagementProvider>
      </body>
    </html>
  );
}
