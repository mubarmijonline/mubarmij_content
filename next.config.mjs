import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "www.mubarmijonline.com" },
      { protocol: "https", hostname: "mubarmijonline.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  async redirects() {
    return [
      // /clients/[slug] was a duplicate implementation of the case-study page.
      { source: "/clients/:slug", destination: "/case-studies/:slug", permanent: true },
      { source: "/:locale(ar)/clients/:slug", destination: "/:locale/case-studies/:slug", permanent: true },
    ];
  },
  async rewrites() {
    // Always on, in every environment.
    //
    // nginx maps /api/media straight to the CMS, so a *browser* request never
    // reaches this app. But next/image resolves relative URLs against its own
    // origin, so the optimizer fetches /api/media from the Next server itself
    // — where, without this rewrite, it 404s and every CMS image 400s.
    // Gating this on NODE_ENV breaks images in production; don't.
    //
    // CMS_MEDIA_URL lets media come from a different CMS instance than the API
    // — useful in a worktree, whose cms/media directory is empty.
    const cms =
      process.env.CMS_MEDIA_URL || process.env.CMS_INTERNAL_URL || "http://localhost:3001";
    return [{ source: "/api/media/:path*", destination: `${cms}/api/media/:path*` }];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
