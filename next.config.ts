import type { NextConfig } from "next";

/**
 * Headers sent with every page. They stop the site being shown inside another site's frame (clickjacking),
 * stop browsers guessing file types, limit what the page can do with the camera, microphone and location,
 * and in production make browsers stick to HTTPS.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Only the directives that can't break the page's own scripts and styles.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

/**
 * Identity documents get the strictest rules: shown on their own, able to run or load nothing, and never sent on
 * as a referrer. These replace the general set (headers from here win over a route's own).
 */
const documentHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Content-Security-Policy", value: "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox" },
  { key: "Cache-Control", value: "private, no-store" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/api/admin/kyc/:path*", headers: documentHeaders },
      // Everything else gets the general set.
      { source: "/((?!api/admin/kyc/).*)", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
