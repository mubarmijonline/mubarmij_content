import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { getBlog, getClients } from "@/lib/v1";
import { caseStudyClients } from "@/lib/content/clients";

export const revalidate = 3600;

const STATIC_PATHS = [
  "",
  "/services",
  "/services/ecommerce",
  "/services/web-development",
  "/services/mobile-apps",
  "/services/automation",
  "/services/maintenance",
  "/case-studies",
  "/reels",
  "/resources",
  "/blog",
  "/about",
  "/pricing",
  "/contact",
  "/book-call",
  "/privacy-policy",
  "/terms-of-service",
];

function entry(path: string, lastModified: Date): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path || "/"}`,
    lastModified,
    alternates: {
      languages: {
        en: `${SITE_URL}${path || "/"}`,
        ar: `${SITE_URL}/ar${path}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Detail pages come from the CMS. Logo-only client stubs are filtered out —
  // they have no slug and no case study to land on.
  const [clientsEnv, blogEnv] = await Promise.all([
    getClients("en", { page_size: 100 }),
    getBlog("en", { page_size: 100 }),
  ]);

  const clientPaths = caseStudyClients(clientsEnv?.data ?? []).map(
    (c) => `/case-studies/${encodeURIComponent(c.slug)}`,
  );
  const blogPaths = (blogEnv?.data ?? [])
    .filter((p) => p.slug)
    .map((p) => `/blog/${encodeURIComponent(p.slug)}`);

  return [...STATIC_PATHS, ...clientPaths, ...blogPaths].map((p) => entry(p, now));
}
