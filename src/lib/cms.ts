// Lightweight Payload CMS REST client used by server components.
// The CMS runs on port 3001 alongside the public site. We reach it directly
// via http://localhost:3001 to avoid the public TLS + nginx hop.

const CMS_INTERNAL_URL =
  process.env.CMS_INTERNAL_URL || "http://localhost:3001";

const CMS_PUBLIC_URL =
  process.env.NEXT_PUBLIC_CMS_URL || ""; // empty → same origin via nginx

export type CmsMedia = {
  id: string;
  url: string;
  alt?: string;
  filename?: string;
  width?: number;
  height?: number;
};

/**
 * Build a fully qualified URL the browser can use for an uploaded file.
 * Payload returns relative URLs like `/api/media/file/foo.png`. When served
 * behind nginx those resolve under the same origin, so a plain relative path
 * is safe and works in both dev and prod.
 */
export function mediaUrl(media: Pick<CmsMedia, "url"> | null | undefined): string {
  if (!media || !media.url) return "";
  if (media.url.startsWith("http")) return media.url;
  if (CMS_PUBLIC_URL) return `${CMS_PUBLIC_URL.replace(/\/$/, "")}${media.url}`;
  return media.url;
}

type FetchOpts = {
  /** ISR revalidate window in seconds. 0 (default) = no cache, always fresh. */
  revalidate?: number;
  /** Force live fetch (no cache). Equivalent to revalidate: 0. */
  noStore?: boolean;
};

export async function cmsFetch<T = unknown>(
  pathWithQuery: string,
  opts: FetchOpts = {}
): Promise<T | null> {
  const url = `${CMS_INTERNAL_URL.replace(/\/$/, "")}${pathWithQuery}`;
  // Default to no caching so CMS edits appear on the public site immediately.
  // The public Next server and the CMS run on the same host, so the network
  // cost is negligible.
  const noStore = opts.noStore ?? (opts.revalidate ?? 0) === 0;
  try {
    const res = await fetch(url, {
      next: noStore ? undefined : { revalidate: opts.revalidate as number },
      cache: noStore ? "no-store" : undefined,
    });
    if (!res.ok) {
      console.warn(`[cms] ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[cms] fetch failed ${url}:`, err);
    return null;
  }
}

export type CmsListResponse<T> = {
  docs: T[];
  totalDocs: number;
};

export type CmsClientLogo = {
  id: string;
  name: string;
  slug?: string;
  logo: CmsMedia;
  websiteUrl?: string;
  darkCard?: boolean;
  displayOnHomepage?: boolean;
  order?: number;
  publishStatus?: "draft" | "published";
};

export async function getClientLogos(): Promise<CmsClientLogo[]> {
  const data = await cmsFetch<CmsListResponse<CmsClientLogo>>(
    "/api/client-logos?where[displayOnHomepage][equals]=true&sort=order&depth=1&limit=100"
  );
  return data?.docs ?? [];
}

// ---------------- Client profile (full record) ----------------

export type CmsClientProfile = CmsClientLogo & {
  tagline?: string;
  industry?: string;
  industryCustom?: string;
  country?: string;
  foundedYear?: number;
  shortDescription?: string;
  description?: unknown; // lexical JSON
  services?: string[];
  coverImage?: CmsMedia | null;
  // After the admin migration `screenshots` is a `hasMany` upload field
  // (array of media docs). The legacy shape (array of {image, caption}) is
  // also accepted so older records keep rendering.
  screenshots?: Array<
    CmsMedia | { id?: string; image: CmsMedia; caption?: string }
  >;
  videos?: Array<{
    id?: string;
    source: "youtube" | "vimeo" | "upload";
    url?: string;
    file?: CmsMedia | null;
    title?: string;
    thumbnail?: CmsMedia | null;
  }>;
  metrics?: Array<{ id?: string; label: string; value: string }>;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  techStack?: Array<{ id?: string; label: string }>;
  timeline?: string;
  featured?: boolean;
  updatedAt?: string;
};

/** Fetch a single client profile by slug, in the requested locale.
 *  A profile is considered visible unless `publishStatus` is explicitly
 *  set to `draft`. We filter in JS because Payload's `not_equals` operator
 *  did not reliably filter the select field in our setup. */
export async function getClientProfile(
  slug: string,
  locale: string = "en"
): Promise<CmsClientProfile | null> {
  const q = `/api/client-logos?where[slug][equals]=${encodeURIComponent(
    slug
  )}&locale=${encodeURIComponent(locale)}&depth=2&limit=1`;
  const data = await cmsFetch<CmsListResponse<CmsClientProfile>>(q);
  const doc = data?.docs?.[0];
  if (!doc) return null;
  if (doc.publishStatus === "draft") return null;
  return doc;
}

/** All visible profiles (anything not explicitly draft). */
export async function getPublishedClientProfiles(
  locale: string = "en"
): Promise<CmsClientProfile[]> {
  const q = `/api/client-logos?locale=${encodeURIComponent(
    locale
  )}&sort=order&depth=1&limit=200`;
  const data = await cmsFetch<CmsListResponse<CmsClientProfile>>(q);
  return (data?.docs ?? []).filter((d) => d.publishStatus !== "draft");
}

/** Up to `count` other published profiles, excluding the given slug. */
export async function getRelatedClients(
  excludeSlug: string,
  count: number = 3,
  locale: string = "en"
): Promise<CmsClientProfile[]> {
  const all = await getPublishedClientProfiles(locale);
  return all.filter((d) => d.slug !== excludeSlug).slice(0, count);
}
