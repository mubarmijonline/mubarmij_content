"use client";

import { useState } from "react";

import type { Locale } from "@/i18n/config";
import { submitGuide } from "@/lib/v1-client";
import { SectionEyebrow } from "@/components/system";

const GUIDE_SLUG = "automation-playbook";

const COPY = {
  en: {
    eyebrow: "Free guide",
    title: "The Automation Playbook for growing businesses",
    sub: "10 workflows you can automate this month — with real examples and time saved. Get the PDF in your inbox.",
    name: "Your name",
    email: "Work email",
    phone: "Phone (optional)",
    submit: "Send me the guide",
    sending: "Sending…",
    success: "Done! Check your inbox — the guide is on its way.",
    error: "Something went wrong. Please try again.",
  },
  ar: {
    eyebrow: "دليل مجاني",
    title: "دليل الأتمتة للشركات النامية",
    sub: "10 عمليات تقدر تأتمتها الشهر ده — بأمثلة حقيقية والوقت الموفّر. هيوصلك PDF على بريدك.",
    name: "اسمك",
    email: "بريد العمل",
    phone: "الهاتف (اختياري)",
    submit: "ابعتلي الدليل",
    sending: "جارٍ الإرسال…",
    success: "تمام! تحقّق من بريدك — الدليل في طريقه إليك.",
    error: "حصل خطأ. حاول مرة أخرى.",
  },
} as const;

type Status = "idle" | "loading" | "success" | "error";

/** P1 §9 — dark lead magnet; 3-field form posts to /v1/leads/guide with a honeypot. */
export default function LeadMagnet({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [form, setForm] = useState({ name: "", email: "", phone: "", company_url: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    setFields({});
    const res = await submitGuide(
      {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        guide_slug: GUIDE_SLUG,
        company_url: form.company_url,
      },
      locale,
    );
    if (res.ok) {
      setStatus("success");
      setMessage(t.success);
    } else {
      setStatus("error");
      setFields(res.fields || {});
      setMessage(res.message || t.error);
    }
  }

  const inputCls =
    "w-full rounded-tile border border-line bg-panel/60 px-4 py-3 text-sm text-cream placeholder:text-bodydark focus-gold";

  return (
    <section className="bg-navy-deep px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-10 rounded-tile border border-line bg-panel/40 p-8 md:grid-cols-2 md:p-12">
        <div>
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-2xl font-semibold tracking-[-0.02em] text-cream md:text-3xl">
            {t.title}
          </h2>
          <p className="mt-4 leading-relaxed text-bodydark">{t.sub}</p>
        </div>

        {status === "success" ? (
          <p className="rounded-tile border border-gold/40 bg-gold/10 px-5 py-6 text-center font-medium text-gold-light" role="status">
            {t.success}
          </p>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
            <input
              type="text"
              name="company_url"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
              value={form.company_url}
              onChange={(e) => set("company_url", e.target.value)}
            />
            <div>
              <input
                type="text"
                required
                placeholder={t.name}
                aria-label={t.name}
                className={inputCls}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
              {fields.name ? <p className="mt-1 text-xs text-red-300">{fields.name}</p> : null}
            </div>
            <div>
              <input
                type="email"
                required
                placeholder={t.email}
                aria-label={t.email}
                className={inputCls}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
              {fields.email ? <p className="mt-1 text-xs text-red-300">{fields.email}</p> : null}
            </div>
            <div>
              <input
                type="tel"
                placeholder={t.phone}
                aria-label={t.phone}
                className={inputCls}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              {fields.phone ? <p className="mt-1 text-xs text-red-300">{fields.phone}</p> : null}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-1 inline-flex items-center justify-center rounded-pill bg-gold px-6 py-3 text-sm font-medium text-gold-ink transition-transform hover:scale-[1.03] focus-gold disabled:opacity-60"
            >
              {status === "loading" ? t.sending : t.submit}
            </button>
            {status === "error" && message ? (
              <p className="text-xs text-red-300" role="status">
                {message}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
