"use client";

import { useState } from "react";

import type { Locale } from "@/i18n/config";
import { submitConsultation, type ConsultationBody } from "@/lib/v1-client";

const COPY = {
  en: {
    name: "Your name",
    email: "Email",
    phone: "Phone (optional)",
    channel: "Preferred channel",
    channels: { whatsapp: "WhatsApp", call: "Phone call", email: "Email" },
    topic: "What's it about?",
    topics: ["Website / web app", "Automation", "Mobile app", "Maintenance & support", "Something else"],
    day: "Preferred day",
    window: "Preferred time",
    windows: { morning: "Morning", afternoon: "Afternoon", evening: "Evening" },
    notes: "Anything we should know? (optional)",
    submit: "Request my consultation",
    sending: "Sending…",
    success: "Got it! We'll reach out to confirm your slot shortly.",
    error: "Something went wrong. Please try again.",
    required: "Please fill in the required fields.",
  },
  ar: {
    name: "اسمك",
    email: "الإيميل",
    phone: "الهاتف (اختياري)",
    channel: "وسيلة التواصل المفضّلة",
    channels: { whatsapp: "واتساب", call: "مكالمة هاتفية", email: "إيميل" },
    topic: "الموضوع عن إيه؟",
    topics: ["موقع / تطبيق ويب", "أتمتة", "تطبيق موبايل", "صيانة ودعم", "حاجة تانية"],
    day: "اليوم المفضّل",
    window: "الوقت المفضّل",
    windows: { morning: "صباحًا", afternoon: "بعد الظهر", evening: "مساءً" },
    notes: "أي حاجة المفروض نعرفها؟ (اختياري)",
    submit: "اطلب استشارتي",
    sending: "جارٍ الإرسال…",
    success: "تمام! هنتواصل معاك قريب لتأكيد الموعد.",
    error: "حصل خطأ. حاول مرة أخرى.",
    required: "من فضلك املأ الحقول المطلوبة.",
  },
} as const;

type Status = "idle" | "loading" | "success" | "error";

export default function ConsultationForm({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_channel: "whatsapp" as ConsultationBody["preferred_channel"],
    topic: t.topics[0] as string,
    preferred_day: "",
    preferred_time_window: "morning" as ConsultationBody["preferred_time_window"],
    notes: "",
    company_url: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!form.name || !form.email || !form.preferred_day) {
      setStatus("error");
      setMessage(t.required);
      return;
    }
    setStatus("loading");
    setMessage("");
    setFields({});
    const res = await submitConsultation(
      {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        preferred_channel: form.preferred_channel,
        preferred_day: form.preferred_day,
        preferred_time_window: form.preferred_time_window,
        topic: form.topic,
        notes: form.notes || undefined,
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

  if (status === "success") {
    return (
      <p
        className="rounded-tile border border-gold/50 bg-gold/10 px-5 py-8 text-center font-medium text-navy-deep"
        role="status"
      >
        {t.success}
      </p>
    );
  }

  const inputCls =
    "w-full rounded-tile border border-neutral-300 bg-white px-4 py-3 text-sm text-navy-deep placeholder:text-neutral-400 focus-gold";
  const labelCls = "mb-1.5 block text-sm font-medium text-navy-deep";

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="cf-name">
            {t.name}
          </label>
          <input
            id="cf-name"
            type="text"
            required
            className={inputCls}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          {fields.name ? <p className="mt-1 text-xs text-red-500">{fields.name}</p> : null}
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-email">
            {t.email}
          </label>
          <input
            id="cf-email"
            type="email"
            required
            className={inputCls}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          {fields.email ? <p className="mt-1 text-xs text-red-500">{fields.email}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="cf-phone">
            {t.phone}
          </label>
          <input
            id="cf-phone"
            type="tel"
            className={inputCls}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-channel">
            {t.channel}
          </label>
          <select
            id="cf-channel"
            className={inputCls}
            value={form.preferred_channel}
            onChange={(e) => set("preferred_channel", e.target.value as ConsultationBody["preferred_channel"])}
          >
            <option value="whatsapp">{t.channels.whatsapp}</option>
            <option value="call">{t.channels.call}</option>
            <option value="email">{t.channels.email}</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="cf-topic">
          {t.topic}
        </label>
        <select id="cf-topic" className={inputCls} value={form.topic} onChange={(e) => set("topic", e.target.value)}>
          {t.topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="cf-day">
            {t.day}
          </label>
          <input
            id="cf-day"
            type="date"
            required
            className={inputCls}
            value={form.preferred_day}
            onChange={(e) => set("preferred_day", e.target.value)}
          />
          {fields.preferred_day ? <p className="mt-1 text-xs text-red-500">{fields.preferred_day}</p> : null}
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-window">
            {t.window}
          </label>
          <select
            id="cf-window"
            className={inputCls}
            value={form.preferred_time_window}
            onChange={(e) => set("preferred_time_window", e.target.value as ConsultationBody["preferred_time_window"])}
          >
            <option value="morning">{t.windows.morning}</option>
            <option value="afternoon">{t.windows.afternoon}</option>
            <option value="evening">{t.windows.evening}</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="cf-notes">
          {t.notes}
        </label>
        <textarea
          id="cf-notes"
          rows={3}
          className={inputCls}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 inline-flex items-center justify-center rounded-pill bg-gold px-6 py-3 text-sm font-medium text-gold-ink transition-transform hover:scale-[1.03] focus-gold disabled:opacity-60"
      >
        {status === "loading" ? t.sending : t.submit}
      </button>
      {status === "error" && message ? (
        <p className="text-sm text-red-500" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
