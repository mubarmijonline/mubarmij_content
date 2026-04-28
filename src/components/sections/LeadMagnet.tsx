"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  // honeypot
  company_url: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function LeadMagnet() {
  const t = useTranslations("leadMagnet");
  const tCta = useTranslations("cta");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "lead_magnet_homepage" }),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="section bg-gradient-to-br from-navy-deep via-navy to-gold-600 text-white">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-sm font-semibold text-gold">
            {t("eyebrow")}
          </span>
          <h2 className="mt-3 font-display rtl:font-arabic-display text-3xl md:text-4xl font-extrabold leading-tight">
            {t("headline")}
          </h2>
          <p className="mt-4 text-white/85 leading-relaxed">{t("sub")}</p>
        </div>

        <div className="rounded-2xl bg-white text-navy-deep p-6 md:p-8 shadow-navy">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl">✓</div>
              <p className="mt-3 font-semibold">
                {t("footnote")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                {...register("company_url")}
              />
              <Field
                label={t("form.name")}
                error={errors.name?.message}
                input={
                  <input
                    type="text"
                    autoComplete="name"
                    className="input"
                    {...register("name")}
                  />
                }
              />
              <Field
                label={t("form.email")}
                error={errors.email?.message}
                input={
                  <input
                    type="email"
                    autoComplete="email"
                    className="input"
                    {...register("email")}
                  />
                }
              />
              <Field
                label={t("form.phone")}
                error={errors.phone?.message}
                input={
                  <input
                    type="tel"
                    autoComplete="tel"
                    className="input"
                    {...register("phone")}
                  />
                }
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center text-lg py-4"
              >
                {tCta("leadMagnet")} ←
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <p className="text-xs text-navy/70 text-center">{t("footnote")}</p>
            </form>
          )}
        </div>
      </div>
      <style>{`.input{width:100%;border:1px solid #E5E7EB;border-radius:.5rem;padding:.6rem .75rem;font-size:1rem;color:#0A1628}.input:focus{outline:2px solid #D4A24C;border-color:#D4A24C}`}</style>
    </section>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-1">{label}</span>
      {input}
      {error && <span className="block mt-1 text-xs text-red-600">{error}</span>}
    </label>
  );
}
