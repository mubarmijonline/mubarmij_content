"use client";

import { useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";
import { submitRoi } from "@/lib/v1-client";
import { SectionEyebrow } from "@/components/system";

const UI = {
  en: {
    eyebrow: "ROI calculator",
    title: "See what automation is worth to you",
    employees: "Team members doing repetitive work",
    hours: "Hours/day each spends on it",
    salary: "Average monthly salary (EGP)",
    estHours: "Hours saved / month",
    estSavings: "Saved / month",
    cta: "Get my full report",
    sending: "Sending…",
    name: "Your name",
    email: "Work email",
    phone: "Phone (optional)",
    success: "Here's your verified estimate — we'll be in touch with the full breakdown.",
    error: "Something went wrong. Please try again.",
    perYear: "That's about {v} / year.",
  },
  ar: {
    eyebrow: "حاسبة العائد",
    title: "شوف الأتمتة بتوفّرلك كام",
    employees: "عدد الأفراد اللي بيعملوا شغل متكرر",
    hours: "ساعات/اليوم لكل فرد على الشغل ده",
    salary: "متوسط الراتب الشهري (ج.م)",
    estHours: "ساعات موفّرة / شهر",
    estSavings: "التوفير / شهر",
    cta: "احصل على تقريرك الكامل",
    sending: "جارٍ الإرسال…",
    name: "اسمك",
    email: "بريد العمل",
    phone: "الهاتف (اختياري)",
    success: "ده تقديرك الموثّق — هنتواصل معاك بالتفاصيل الكاملة.",
    error: "حصل خطأ. حاول مرة أخرى.",
    perYear: "يعني حوالي {v} / سنة.",
  },
} as const;

const WORK_HOURS_PER_MONTH = 176;
const SAVE_RATE = 0.7;

export default function RoiCalculator({ locale }: { locale: Locale }) {
  const ui = UI[locale];
  const nf = useMemo(() => new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US"), [locale]);

  const [employees, setEmployees] = useState(5);
  const [hours, setHours] = useState(2);
  const [salary, setSalary] = useState(8000);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company_url: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [server, setServer] = useState<{ savings: number; hours: number } | null>(null);

  const est = useMemo(() => {
    const hourly = salary / WORK_HOURS_PER_MONTH;
    const hoursSaved = Math.round(employees * hours * 22 * SAVE_RATE);
    const savings = Math.round(hoursSaved * hourly);
    return { hoursSaved, savings };
  }, [employees, hours, salary]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    const res = await submitRoi(
      {
        employees,
        daily_hours_per_employee: hours,
        monthly_salary_egp: salary,
        computed_monthly_savings_egp: est.savings,
        computed_monthly_hours_saved: est.hoursSaved,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company_url: form.company_url,
      },
      locale,
    );
    if (res.ok) {
      setServer({
        savings: res.data.server_computed_monthly_savings_egp,
        hours: res.data.server_computed_monthly_hours_saved,
      });
      setStatus("success");
    } else {
      setStatus("error");
      setMessage(res.message || ui.error);
    }
  }

  const shown = server ?? { savings: est.savings, hours: est.hoursSaved };
  const yearly = ui.perYear.replace("{v}", `${nf.format(shown.savings * 12)} EGP`);

  return (
    <section id="roi" className="scroll-mt-24 bg-surface px-4 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{ui.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-fg md:text-4xl">
            {ui.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 rounded-card border border-hair bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
          {/* Inputs */}
          <div className="grid gap-5">
            <Field label={ui.employees} value={employees} min={1} max={500} step={1} onChange={setEmployees} fmt={nf} />
            <Field label={ui.hours} value={hours} min={0} max={8} step={0.5} onChange={setHours} fmt={nf} />
            <Field label={ui.salary} value={salary} min={1000} max={100000} step={500} onChange={setSalary} fmt={nf} />
          </div>

          {/* Result */}
          <div className="flex flex-col justify-between rounded-card bg-ink p-6 text-fg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-3xl font-semibold text-gold">{nf.format(shown.hours)}</div>
                <div className="mt-1 text-sm text-fgbody">{ui.estHours}</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-semibold text-gold">{nf.format(shown.savings)}</div>
                <div className="mt-1 text-sm text-fgbody">{ui.estSavings} (EGP)</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-fgbody">{yearly}</p>

            {status === "success" ? (
              <p className="mt-6 rounded-card border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-medium text-gold-light" role="status">
                {ui.success}
              </p>
            ) : open ? (
              <form className="mt-6 flex flex-col gap-3" onSubmit={onSubmit} noValidate>
                <input
                  type="text"
                  name="company_url"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                  value={form.company_url}
                  onChange={(e) => setForm((f) => ({ ...f, company_url: e.target.value }))}
                />
                <input
                  type="text"
                  required
                  placeholder={ui.name}
                  aria-label={ui.name}
                  className="rounded-card border border-hair bg-well/60 px-4 py-2.5 text-sm text-fg placeholder:text-fgbody focus-gold"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                  type="email"
                  required
                  placeholder={ui.email}
                  aria-label={ui.email}
                  className="rounded-card border border-hair bg-well/60 px-4 py-2.5 text-sm text-fg placeholder:text-fgbody focus-gold"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder={ui.phone}
                  aria-label={ui.phone}
                  className="rounded-card border border-hair bg-well/60 px-4 py-2.5 text-sm text-fg placeholder:text-fgbody focus-gold"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-pill bg-gold px-5 py-2.5 text-sm font-medium text-gold-ink transition-transform hover:scale-[1.03] focus-gold disabled:opacity-60"
                >
                  {status === "loading" ? ui.sending : ui.cta}
                </button>
                {status === "error" && message ? <p className="text-xs text-red-300">{message}</p> : null}
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-6 rounded-pill bg-gold px-5 py-2.5 text-sm font-medium text-gold-ink transition-transform hover:scale-[1.03] focus-gold"
              >
                {ui.cta}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt: Intl.NumberFormat;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm text-fgmuted">
        {label}
        <span className="font-mono font-medium text-fg">{fmt.format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-gold"
        aria-label={label}
      />
    </label>
  );
}
