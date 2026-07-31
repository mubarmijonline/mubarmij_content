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
    // In production nginx fronts both apps on one origin, so /api/media/*
    // already resolves. On a dev server it 404s, which silently turns every
    // CMS image into its empty state. Proxy it locally instead.
    // Production is fronted by nginx, which already serves /api/media on the
    // public origin — so the rewrite stays off unless CMS_MEDIA_URL is set
    // explicitly, which is how you test a production build locally.
    const explicit = process.env.CMS_MEDIA_URL;
    if (process.env.NODE_ENV === "production" && !explicit) return [];
    // CMS_MEDIA_URL also lets media come from a different CMS instance than the
    // API — useful in a worktree, whose cms/media directory is empty.
    const cms = explicit || process.env.CMS_INTERNAL_URL || "http://localhost:3001";
    return [{ source: "/api/media/:path*", destination: `${cms}/api/media/:path*` }];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
