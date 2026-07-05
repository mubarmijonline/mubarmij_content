import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

// Single CRM endpoint per spec.
// TODO (Phase 4): wire HubSpot/Pipedrive + Brevo + reCAPTCHA v3 verification + rate limiting.

const schema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(40).optional(),
  source: z.string().max(80).optional(),
  message: z.string().max(4000).optional(),
  // honeypot — must be empty
  company_url: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 },
      );
    }

    // TODO: verify reCAPTCHA token, rate limit by IP, push to CRM, enqueue Brevo email.
    // Intentionally minimal during foundation phase.

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
