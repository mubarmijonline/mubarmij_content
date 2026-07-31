"use client";

import { useState } from "react";

import { submitNewsletter } from "@/lib/v1-client";
import type { Locale } from "@/i18n/config";

type Status = "idle" | "loading" | "subscribed" | "already" | "error";

const COPY: Record<Locale, { subscribed: string; already: string; error: string }> = {
  en: {
    subscribed: "You're in — check your inbox.",
    already: "You're already subscribed. Thanks!",
    error: "Couldn't subscribe. Please try again.",
  },
  ar: {
    subscribed: "تم الاشتراك — تحقّق من بريدك.",
    already: "أنت مشترك بالفعل. شكرًا لك!",
    error: "تعذّر الاشتراك. حاول مرة أخرى.",
  },
};

export default function NewsletterForm({
  locale,
  placeholder,
  label,
}: {
  locale: Locale;
  placeholder: string;
  label: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const copy = COPY[locale];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    const res = await submitNewsletter({ email, source: "website" }, locale);
    if (res.ok) {
      const subscribed = res.data.status === "subscribed";
      setStatus(subscribed ? "subscribed" : "already");
      setMessage(subscribed ? copy.subscribed : copy.already);
      if (subscribed) setEmail("");
    } else {
      setStatus("error");
      setMessage(res.fields?.email || res.message || copy.error);
    }
  }

  const done = status === "subscribed" || status === "already";

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit} noValidate>
      <div className="flex gap-2">
        {/* Honeypot */}
        <input
          type="text"
          name="company_url"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={done}
          className="min-w-0 flex-1 rounded-pill border border-hair bg-white/5 px-4 py-2 text-sm text-fg placeholder:text-fgbody focus-gold disabled:opacity-60"
          aria-label={placeholder}
        />
        <button
          type="submit"
          disabled={status === "loading" || done}
          className="rounded-pill bg-gold px-4 py-2 text-sm font-medium text-gold-ink transition-transform hover:scale-[1.03] focus-gold disabled:opacity-60"
        >
          {label}
        </button>
      </div>
      {message ? (
        <p className={`text-xs ${status === "error" ? "text-red-300" : "text-gold-light"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
