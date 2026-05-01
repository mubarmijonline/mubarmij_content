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
  /** ISR revalidate window in seconds. Default: 60s. */
  revalidate?: number;
  /** Force live fetch (no cache). */
  noStore?: boolean;
};

export async function cmsFetch<T = unknown>(
  pathWithQuery: string,
  opts: FetchOpts = {}
): Promise<T | null> {
  const url = `${CMS_INTERNAL_URL.replace(/\/$/, "")}${pathWithQuery}`;
  try {
    const res = await fetch(url, {
      next: opts.noStore ? undefined : { revalidate: opts.revalidate ?? 60 },
      cache: opts.noStore ? "no-store" : undefined,
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
  logo: CmsMedia;
  websiteUrl?: string;
  darkCard?: boolean;
  displayOnHomepage?: boolean;
  order?: number;
};

export async function getClientLogos(): Promise<CmsClientLogo[]> {
  const data = await cmsFetch<CmsListResponse<CmsClientLogo>>(
    "/api/client-logos?where[displayOnHomepage][equals]=true&sort=order&depth=1&limit=100"
  );
  return data?.docs ?? [];
}
