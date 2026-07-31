"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Bordered form panel — contact, consultation booking, ROI calculator. */
export function FormCard({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card border border-hair bg-surface p-6 md:p-8", className)}>
      {title ? <h2 className="font-display text-d3 font-semibold text-fg">{title}</h2> : null}
      {subtitle ? <p className="mt-2 text-[15px] text-fgbody">{subtitle}</p> : null}
      <div className={cn("grid gap-4", (title || subtitle) && "mt-6")}>{children}</div>
    </div>
  );
}

const CONTROL =
  "focus-gold w-full rounded-btn border border-hairbtn bg-surface px-3.5 py-3 text-[15px] text-fg outline-none transition-colors placeholder:text-fgfaint focus:border-ink";

/** Labelled field wrapper. `error` renders the API's per-field message. */
export function FieldRow({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("grid gap-1.5", className)}>
      <span className="mono text-[11px] uppercase text-fgmuted">{label}</span>
      {children}
      {error ? <span className="text-[13px] text-red-600">{error}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(CONTROL, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(CONTROL, "resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(CONTROL, props.className)} />;
}

/**
 * Honeypot. Every /api/v1/leads/* endpoint checks `company_url`; a bot that
 * fills it gets a silent success. Hidden from both sight and assistive tech.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company URL
        <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
