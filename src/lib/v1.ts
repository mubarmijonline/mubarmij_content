// Typed client for the public /api/v1 surface (Payload CMS app).
// Server components read via the internal CMS origin; the browser POSTs
// same-origin through nginx. Every response uses the envelope
//   success: { data, meta? }   error: { error: { code, message, fields? } }

import "server-only";

import { cmsMedia } from "@/lib/utils";

const CMS_INTERNAL_URL = process.env.CMS_INTERNAL_URL || "http://localhost:3001";

export type V1Meta = { page?: number; page_size?: number; total?: number; totalPages?: number };
export type V1Ok<T> = { data: T; meta?: V1Meta };
export type V1Err = { error: { code: string; message: string; fields?: Record<string, string> } };

type FetchOpts = { locale?: string; revalidate?: number; query?: Record<string, string | number | boolean | undefined> };

function buildQuery(query?: FetchOpts["query"]): string {
  if (!query) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === "") continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Server-side GET against /api/v1. Returns the parsed envelope, or null on failure. */
export async function v1Get<T>(path: string, opts: FetchOpts = {}): Promise<V1Ok<T> | null> {
  const url = `${CMS_INTERNAL_URL.replace(/\/$/, "")}/api/v1${path}${buildQuery(opts.query)}`;
  const revalidate = opts.revalidate ?? 300;
  try {
    const res = await fetch(url, {
      headers: { "Accept-Language": opts.locale === "ar" ? "ar" : "en" },
      next: { revalidate },
    });
    if (!res.ok) {
      if (res.status !== 404) console.warn(`[v1] ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as V1Ok<T>;
  } catch (err) {
    console.warn(`[v1] fetch failed ${url}:`, err);
    return null;
  }
}

// ----------------------------- Domain types ------------------------------

export type ServiceSummary = {
  slug: string; title: string; tagline: string; icon: string;
  summary: string; deliverables: string[]; proof?: string; order: number;
  /** Typical delivery window, e.g. "5–8 weeks". Optional — older CMS builds omit it. */
  duration?: string;
};
export type ServiceStep = { title: string; body: string };
export type ServiceDetail = ServiceSummary & {
  /** How the engagement runs, stage by stage. */
  process?: ServiceStep[];
  intro: string; hero_image_url?: string; pain_points: string[];
  types: { title: string; icon: string }[]; differentiators: string[];
  has_roi_calculator?: boolean;
};

export type ClientSummary = {
  slug: string; name: string; tagline: string; category: string;
  category_label: string; logo_url?: string; thumb_url?: string;
  /** Logo is light-on-transparent — needs a dark backing to be visible. */
  dark_card?: boolean;
  featured: boolean; order: number; locale: string;
};
export type ClientDetail = {
  slug: string; name: string; tagline: string; category: string; category_label: string;
  hero_image_url?: string; logo_url?: string; gallery: string[];
  brief: string; brief_html: string;
  results: { metric: string; label: string }[]; tech_stack: string[];
  links: { live_url?: string; play_store?: string; app_store?: string };
  services: string[]; featured: boolean; timeline?: string;
  testimonial?: { quote: string; author: string };
};

export type BlogListItem = {
  slug: string; title: string; excerpt: string; cover_image_url?: string;
  category: string; reading_time_minutes: number; published_at: string | null;
};
export type BlogPost = BlogListItem & {
  body_html: string; author: { name: string; avatar_url?: string };
  tags: string[]; related: { slug: string; title: string; cover_image_url?: string }[];
};

export type FaqItem = { id: string; question: string; answer: string; order: number };

export type AboutData = {
  tagline: string; story: string; mission: string;
  values: { title: string; body: string }[];
  expertise: { name: string; level: number }[];
  tech_stack: string[];
  stats: { projects: number; customers: number; years: number; support: string };
  contact: { phone: string; email: string; address: string; hours: string };
};

export type ResourceItem = {
  slug: string; type: string; title: string; description: string;
  cover_image_url?: string; pdf_url?: string; language: string;
  requires_email: boolean; published_at: string | null;
};

export type TestimonialItem = {
  id: string | number; quote: string; author: string; role: string;
  company: string; avatar_url?: string; rating: number;
};

export type ReelItem = {
  id: string; title: string; description?: string;
  source: "hosted" | "embed";
  playback: { hls?: string; mp4?: string } | null;
  embedUrl: string | null;
  thumbnail: { url: string; width?: number; height?: number; alt?: string };
  durationSeconds?: number; category: string;
  client?: { slug: string; name: string } | null;
};

// --------------------------- Convenience reads ---------------------------

export const getServices = (locale: string) =>
  v1Get<ServiceSummary[]>("/services", { locale }).then((r) => r?.data ?? []);

export const getService = (slug: string, locale: string) =>
  v1Get<ServiceDetail>(`/services/${slug}`, { locale }).then((r) => r?.data ?? null);

export const getClients = (locale: string, query?: FetchOpts["query"]) =>
  v1Get<ClientSummary[]>("/clients", { locale, query });

export const getClient = (slug: string, locale: string) =>
  v1Get<ClientDetail>(`/clients/${slug}`, { locale }).then((r) => r?.data ?? null);

export const getBlog = (locale: string, query?: FetchOpts["query"]) =>
  v1Get<BlogListItem[]>("/blog", { locale, query });

export const getBlogPost = (slug: string, locale: string) =>
  v1Get<BlogPost>(`/blog/${slug}`, { locale }).then((r) => r?.data ?? null);

export const getFaq = (locale: string) =>
  v1Get<FaqItem[]>("/faq", { locale }).then((r) => r?.data ?? []);

export const getAbout = (locale: string) =>
  v1Get<AboutData>("/about", { locale }).then((r) => r?.data ?? null);

export const getResources = (locale: string) =>
  v1Get<ResourceItem[]>("/resources", { locale }).then((r) => r?.data ?? []);

export const getTestimonials = (locale: string) =>
  v1Get<TestimonialItem[]>("/testimonials", { locale }).then((r) => r?.data ?? []);

export const getReels = (locale: string, query?: FetchOpts["query"]) =>
  v1Get<ReelItem[]>("/reels", { locale, query }).then((env) => {
    if (!env) return env;
    // Rewrite CMS media hosts to same-origin so URLs serialized into client
    // component payloads stay clean (the public origin serves /api/media/*).
    const data = (env.data ?? []).map((r) => ({
      ...r,
      playback: r.playback ? { ...r.playback, mp4: cmsMedia(r.playback.mp4) || undefined } : r.playback,
      thumbnail: { ...r.thumbnail, url: cmsMedia(r.thumbnail?.url) },
    }));
    return { ...env, data };
  });
