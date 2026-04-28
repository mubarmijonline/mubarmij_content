import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = [
  "",
  "/services/automation",
  "/services/web-development",
  "/services/mobile-apps",
  "/services/maintenance",
  "/case-studies",
  "/pricing",
  "/resources",
  "/blog",
  "/about",
  "/contact",
  "/book-call",
  "/privacy-policy",
  "/terms-of-service",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];
  for (const p of STATIC_PATHS) {
    out.push({
      url: `${SITE_URL}${p || "/"}`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${SITE_URL}${p || "/"}`,
          ar: `${SITE_URL}/ar${p}`,
        },
      },
    });
  }
  return out;
}
