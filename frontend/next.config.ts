import type { NextConfig } from "next";

// Derive Strapi origin for CSP — needed so the browser can load uploaded images.
// NEXT_PUBLIC_STRAPI_URL is available at build time (Next.js inlines NEXT_PUBLIC_ vars).
function getStrapiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL ?? "";
  if (!raw) return "";
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.origin; // e.g. "http://localhost:1337"
  } catch {
    return "";
  }
}

const strapiOrigin = getStrapiOrigin();

// img-src must include the Strapi origin so unoptimized <Image> tags (used for
// profile photos) are not blocked by the browser's CSP enforcement.
const imgSrc = ["'self'", "data:", "blob:", ...(strapiOrigin ? [strapiOrigin] : [])].join(" ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      `img-src ${imgSrc}`,
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Only allow images from our own origin + configured Strapi upstream
    remotePatterns: (() => {
      const url = process.env.NEXT_PUBLIC_STRAPI_URL;
      if (!url) return [];
      try {
        const u = new URL(url);
        return [
          {
            protocol: u.protocol.replace(":", "") as "http" | "https",
            hostname: u.hostname,
            port: u.port || undefined,
            pathname: "/uploads/**",
          },
        ];
      } catch {
        return [];
      }
    })(),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
