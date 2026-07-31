"use client";

import { useState } from "react";

import type { Locale } from "@/i18n/config";
import { submitContact } from "@/lib/v1-client";
import { DarkButton, FieldRow, FormCard, Honeypot, Select, TextArea, TextInput } from "@/components/system";

const COPY = {
  en: {
    title: "Or leave the details",
    subtitle: "We reply within one working day.",
    name: "Name",
    namePh: "Your name",
    email: "Email",
    emailPh: "you@company.com",
    company: "Company",
    companyPh: "Brand or company",
    need: "What do you need?",
    notes: "Anything else",
    notesPh: "Timeline, catalogue size, integrations…",
    send: "Send the brief",
    sending: "Sending…",
    done: "Thanks — we'll reply within one working day.",
    options: [
      { value: "web", label: "E-commerce shop" },
      { value: "web", label: "Website rebuild" },
      { value: "mobile", label: "Mobile app" },
      { value: "automation", label: "Internal system / automation" },
      { value: "general", label: "Not sure yet" },
    ],
  },
  ar: {
    title: "أو سيبلنا بياناتك",
    subtitle: "بنرد خلال يوم عمل واحد.",
    name: "الاسم",
    namePh: "اسمك",
    email: "الإيميل",
    emailPh: "you@company.com",
    company: "الشركة",
    companyPh: "العلامة أو الشركة",
    need: "محتاج إيه؟",
    notes: "أي حاجة تانية",
    notesPh: "المدة، حجم الكتالوج، الأنظمة المطلوب ربطها…",
    send: "ابعت التفاصيل",
    sending: "بنبعت…",
    done: "شكرًا — هنرد عليك خلال يوم عمل واحد.",
    options: [
      { value: "web", label: "متجر إلكتروني" },
      { value: "web", label: "إعادة بناء الموقع" },
      { value: "mobile", label: "تطبيق موبايل" },
      { value: "automation", label: "نظام داخلي / أتمتة" },
      { value: "general", label: "لسه مش متأكد" },
    ],
  },
} as const;

/**
 * Posts to /api/v1/leads/contact, which actually persists the lead.
 *
 * The design draws no email field, but the endpoint requires email, subject
 * and message — and a lead with no way to reply is useless. "What do you
 * need?" maps to `subject`, "Anything else" to `message`.
 */
export default function ContactForm({ locale }: { locale: Locale }) {
  const t = COPY[locale];

  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    setFields({});

    const company = String(form.get("company") || "").trim();
    const notes = String(form.get("notes") || "").trim();

    // `subject` is a fixed server-side enum (general | automation | web |
    // mobile | maintenance | other), so the select submits the enum value and
    // the wording the visitor actually picked is carried in the message.
    const index = Number(form.get("need") || 0);
    const picked = t.options[index] ?? t.options[t.options.length - 1];

    const res = await submitContact(
      {
        name: String(form.get("name") || "").trim(),
        email: String(form.get("email") || "").trim(),
        subject: picked.value,
        // The endpoint requires a non-empty message; fall back to the chosen
        // label so a visitor who only picks a need still submits cleanly.
        message: [company && `Company: ${company}`, `Need: ${picked.label}`, notes]
          .filter(Boolean)
          .join("\n"),
        source: "website",
        locale,
        company_url: String(form.get("company_url") || ""),
      },
      locale,
    );

    setPending(false);
    if (res.ok) {
      setDone(true);
      return;
    }
    setError(res.message);
    if (res.fields) setFields(res.fields);
  }

  if (done) {
    return (
      <FormCard title={t.title}>
        <p className="text-copy text-fgbody">{t.done}</p>
      </FormCard>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative">
      <Honeypot />
      <FormCard title={t.title} subtitle={t.subtitle}>
        <FieldRow label={t.name} htmlFor="contact-name" error={fields.name}>
          <TextInput id="contact-name" name="name" required autoComplete="name" placeholder={t.namePh} />
        </FieldRow>

        <FieldRow label={t.email} htmlFor="contact-email" error={fields.email}>
          <TextInput
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t.emailPh}
          />
        </FieldRow>

        <FieldRow label={t.company} htmlFor="contact-company">
          <TextInput
            id="contact-company"
            name="company"
            autoComplete="organization"
            placeholder={t.companyPh}
          />
        </FieldRow>

        <FieldRow label={t.need} htmlFor="contact-need" error={fields.subject}>
          <Select id="contact-need" name="need" defaultValue="0">
            {t.options.map((o, i) => (
              <option key={o.label} value={i}>
                {o.label}
              </option>
            ))}
          </Select>
        </FieldRow>

        <FieldRow label={t.notes} htmlFor="contact-notes" error={fields.message}>
          <TextArea id="contact-notes" name="notes" rows={4} placeholder={t.notesPh} />
        </FieldRow>

        {error ? <p className="text-[13.5px] text-red-600">{error}</p> : null}

        <DarkButton type="submit" size="lg" disabled={pending} className="justify-center">
          {pending ? t.sending : t.send}
        </DarkButton>
      </FormCard>
    </form>
  );
}
