// Side-effect notifier: emails team, sends WhatsApp click-to-chat link, optional CRM push.
// All channels degrade gracefully when env vars are missing — they just log.

import type { Payload } from "payload"
import { maskEmail, maskPhone } from "./mask"

export type LeadNotification = {
  channel: string
  source: string
  name?: string
  email?: string
  phone?: string
  topic?: string
  subject?: string
  message?: string
  guideSlug?: string
  preferredChannel?: string
  preferredDay?: string
  preferredTimeWindow?: string
  notes?: string
  roi?: {
    employees?: number
    dailyHoursPerEmployee?: number
    monthlySalaryEgp?: number
    serverComputedSavingsEgp?: number
    serverComputedHoursSaved?: number
  }
  locale?: string
  ip?: string
  userAgent?: string
}

const TEAM_EMAIL = process.env.BREVO_TEAM_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@mubarmijonline.com"
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "info@mubarmijonline.com"
const BREVO_KEY = process.env.BREVO_API_KEY || ""
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201200588803"

function fmtPlain(n: LeadNotification): string {
  const lines = [
    `New ${n.channel} lead from ${n.source === "mobile_app" ? "MOBILE APP" : "Website"}`,
    n.name ? `Name: ${n.name}` : "",
    n.email ? `Email: ${n.email}` : "",
    n.phone ? `Phone: ${n.phone}` : "",
    n.topic ? `Topic: ${n.topic}` : "",
    n.subject ? `Subject: ${n.subject}` : "",
    n.guideSlug ? `Guide: ${n.guideSlug}` : "",
    n.preferredChannel ? `Channel preference: ${n.preferredChannel}` : "",
    n.preferredDay ? `Preferred day: ${n.preferredDay}` : "",
    n.preferredTimeWindow ? `Preferred time: ${n.preferredTimeWindow}` : "",
    n.message ? `\nMessage:\n${n.message}` : "",
    n.notes ? `\nNotes:\n${n.notes}` : "",
    n.roi
      ? `\nROI inputs: ${n.roi.employees} employees × ${n.roi.dailyHoursPerEmployee} h/day × ${n.roi.monthlySalaryEgp} EGP\n` +
        `Server-computed savings: ${n.roi.serverComputedSavingsEgp} EGP/mo  (${n.roi.serverComputedHoursSaved} h/mo)`
      : "",
    "",
    `IP: ${n.ip || "?"}    UA: ${n.userAgent || "?"}    Locale: ${n.locale || "en"}`,
  ]
  return lines.filter(Boolean).join("\n")
}

async function sendBrevoEmail(opts: {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
  textContent?: string
  attachment?: { name: string; url?: string; content?: string }[]
}): Promise<boolean> {
  if (!BREVO_KEY) return false
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_KEY,
      },
      body: JSON.stringify({
        sender: { email: SENDER_EMAIL, name: "MubarmiJ" },
        to: opts.to,
        subject: opts.subject,
        htmlContent: opts.htmlContent,
        textContent: opts.textContent,
        attachment: opts.attachment,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function notifyLead(
  payload: Payload,
  n: LeadNotification,
  opts?: { autoReply?: boolean; pdfUrl?: string },
): Promise<void> {
  const text = fmtPlain(n)

  // Team notification (Brevo or fallback log).
  const teamSubject = `[${n.source === "mobile_app" ? "Mobile" : "Web"}] ${n.channel} — ${n.email || n.phone || "anonymous"}`
  const sentTeam = await sendBrevoEmail({
    to: [{ email: TEAM_EMAIL, name: "MubarmiJ Team" }],
    subject: teamSubject,
    htmlContent: `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${text}</pre>`,
    textContent: text,
  })
  if (!sentTeam) {
    payload.logger.info(
      { evt: "lead.notify.team", channel: n.channel, source: n.source, email: maskEmail(n.email), phone: maskPhone(n.phone) },
      "[notify-stub] team email not sent (no BREVO_API_KEY); body logged below",
    )
    payload.logger.info(text)
  }

  // Auto-reply to user (in their locale).
  if (opts?.autoReply && n.email) {
    const isAr = n.locale === "ar"
    const subject = isAr ? "استلمنا طلبك — هنرد عليك خلال ساعة عمل" : "We received your request — replying within 1 business hour"
    const body = isAr
      ? `أهلاً ${n.name || ""}،\n\nاستلمنا طلبك على MubarmiJ. هنرد عليك خلال ساعة عمل.\n\nشكراً،\nفريق MubarmiJ`
      : `Hi ${n.name || ""},\n\nThanks for reaching out to MubarmiJ. We'll get back to you within one business hour.\n\nMubarmiJ Team`
    const sentUser = await sendBrevoEmail({
      to: [{ email: n.email, name: n.name }],
      subject,
      htmlContent: `<p>${body.replace(/\n/g, "<br/>")}</p>`,
      textContent: body,
      attachment: opts.pdfUrl ? [{ name: "guide.pdf", url: opts.pdfUrl }] : undefined,
    })
    if (!sentUser) {
      payload.logger.info(
        { evt: "lead.notify.autoreply", to: maskEmail(n.email) },
        "[notify-stub] auto-reply not sent (no BREVO_API_KEY)",
      )
    }
  }

  // WhatsApp click-to-chat URL — logged for now (no Cloud API integration yet).
  const waText = encodeURIComponent(text)
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`
  payload.logger.info({ evt: "lead.notify.whatsapp_link", url: waUrl.slice(0, 200) + "…" }, "WhatsApp deep link prepared")
}
