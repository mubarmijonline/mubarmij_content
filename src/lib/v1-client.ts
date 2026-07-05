// Browser-side helpers for the /api/v1 POST surface. Same-origin via nginx.
// Returns a discriminated result so forms can render inline `fields` errors.

export type SubmitResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; code: string; message: string; fields?: Record<string, string> };

async function post<T>(path: string, body: Record<string, unknown>, locale = "en"): Promise<SubmitResult<T>> {
  try {
    const res = await fetch(`/api/v1${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept-Language": locale === "ar" ? "ar" : "en" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, status: res.status, data: (json.data ?? json) as T };
    const err = (json.error ?? {}) as { code?: string; message?: string; fields?: Record<string, string> };
    return {
      ok: false,
      status: res.status,
      code: err.code || "SERVER_ERROR",
      message: err.message || "Something went wrong. Please try again.",
      fields: err.fields,
    };
  } catch {
    return { ok: false, status: 0, code: "NETWORK", message: "Network error. Please check your connection." };
  }
}

export type ContactBody = { name: string; email: string; phone?: string; subject: string; message: string; locale?: string; source?: string; company_url?: string };
export const submitContact = (b: ContactBody, locale?: string) =>
  post<{ id: string; status: string }>("/leads/contact", { source: "mobile_app", ...b }, locale);

export type GuideBody = { name: string; email: string; phone?: string; guide_slug: string; locale?: string; source?: string; company_url?: string };
export const submitGuide = (b: GuideBody, locale?: string) =>
  post<{ id: string; delivery: string }>("/leads/guide", { source: "website", ...b }, locale);

export type NewsletterBody = { email: string; locale?: string; source?: string; company_url?: string };
export const submitNewsletter = (b: NewsletterBody, locale?: string) =>
  post<{ status: "subscribed" | "already_subscribed" }>("/leads/newsletter", { source: "website", ...b }, locale);

export type ConsultationBody = {
  name: string; email: string; phone?: string;
  preferred_channel: "whatsapp" | "call" | "email";
  preferred_day: string; preferred_time_window: "morning" | "afternoon" | "evening";
  topic: string; notes?: string; locale?: string; source?: string; company_url?: string;
};
export const submitConsultation = (b: ConsultationBody, locale?: string) =>
  post<{ id: string; status: string }>("/leads/consultation", { source: "website", ...b }, locale);

export type RoiBody = {
  employees: number; daily_hours_per_employee: number; monthly_salary_egp: number;
  computed_monthly_savings_egp?: number; computed_monthly_hours_saved?: number;
  name: string; email: string; phone?: string; locale?: string; source?: string; company_url?: string;
};
export const submitRoi = (b: RoiBody, locale?: string) =>
  post<{ id: string; server_computed_monthly_savings_egp: number; server_computed_monthly_hours_saved: number }>(
    "/leads/roi",
    { source: "website", ...b },
    locale,
  );

export type AnalyticsEvent = { event: string; reelId?: string; locale?: string; source?: string; [k: string]: unknown };
export const trackEvent = (e: AnalyticsEvent) =>
  post("/analytics", e).catch(() => undefined);
