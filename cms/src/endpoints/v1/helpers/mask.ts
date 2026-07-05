// Mask PII in logs.
export function maskEmail(e?: string | null): string {
  if (!e) return ""
  const [local, domain] = e.split("@")
  if (!domain) return "***"
  const head = local!.slice(0, 1)
  return `${head}***@${domain}`
}

export function maskPhone(p?: string | null): string {
  if (!p) return ""
  const digits = p.replace(/\D/g, "")
  if (digits.length < 4) return "***"
  return `***${digits.slice(-4)}`
}
