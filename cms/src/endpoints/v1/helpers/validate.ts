// Tiny zod-style validator (no extra dep). Sufficient for the v1 endpoints.

export type ValidationIssue = { path: string; message: string }
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: ValidationIssue[] }

type Rule<T = unknown> = {
  type:
    | "string"
    | "email"
    | "phone"
    | "enum"
    | "int"
    | "number"
    | "boolean"
    | "date"
    | "array"
    | "object"
  optional?: boolean
  trim?: boolean
  min?: number
  max?: number
  enumValues?: readonly string[]
  itemRule?: Rule
  shape?: Record<string, Rule>
  futureDate?: boolean
  default?: T
}

export const v = {
  string: (opts: Partial<Rule> = {}): Rule => ({ type: "string", trim: true, ...opts }),
  email: (opts: Partial<Rule> = {}): Rule => ({ type: "email", trim: true, ...opts }),
  phone: (opts: Partial<Rule> = {}): Rule => ({ type: "phone", trim: true, ...opts }),
  enum: <T extends readonly string[]>(values: T, opts: Partial<Rule> = {}): Rule => ({
    type: "enum",
    enumValues: values,
    ...opts,
  }),
  int: (opts: Partial<Rule> = {}): Rule => ({ type: "int", ...opts }),
  number: (opts: Partial<Rule> = {}): Rule => ({ type: "number", ...opts }),
  boolean: (opts: Partial<Rule> = {}): Rule => ({ type: "boolean", ...opts }),
  date: (opts: Partial<Rule> = {}): Rule => ({ type: "date", ...opts }),
  array: (item: Rule, opts: Partial<Rule> = {}): Rule => ({ type: "array", itemRule: item, ...opts }),
  object: (shape: Record<string, Rule>, opts: Partial<Rule> = {}): Rule => ({ type: "object", shape, ...opts }),
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const E164_RE = /^\+[1-9]\d{6,14}$/

function validateRule(value: unknown, rule: Rule, path: string, issues: ValidationIssue[]): unknown {
  // optional + missing → undefined
  if (value === undefined || value === null || value === "") {
    if (rule.optional) return rule.default
    issues.push({ path, message: "Required." })
    return undefined
  }

  switch (rule.type) {
    case "string": {
      if (typeof value !== "string") { issues.push({ path, message: "Must be a string." }); return undefined }
      let s = rule.trim ? value.trim() : value
      if (rule.min != null && s.length < rule.min) issues.push({ path, message: `Must be at least ${rule.min} characters.` })
      if (rule.max != null && s.length > rule.max) issues.push({ path, message: `Must be at most ${rule.max} characters.` })
      return s
    }
    case "email": {
      if (typeof value !== "string") { issues.push({ path, message: "Must be a string." }); return undefined }
      const s = value.trim().toLowerCase()
      if (!EMAIL_RE.test(s)) { issues.push({ path, message: "Must be a valid email." }); return undefined }
      return s
    }
    case "phone": {
      if (typeof value !== "string") { issues.push({ path, message: "Must be a string." }); return undefined }
      const s = normalizePhone(value)
      if (!s || !E164_RE.test(s)) { issues.push({ path, message: "Must be a valid phone (E.164)." }); return undefined }
      return s
    }
    case "enum": {
      if (!rule.enumValues!.includes(String(value))) {
        issues.push({ path, message: `Must be one of: ${rule.enumValues!.join(", ")}.` })
        return undefined
      }
      return String(value)
    }
    case "int": {
      const n = Number(value)
      if (!Number.isInteger(n)) { issues.push({ path, message: "Must be an integer." }); return undefined }
      if (rule.min != null && n < rule.min) issues.push({ path, message: `Must be ≥ ${rule.min}.` })
      if (rule.max != null && n > rule.max) issues.push({ path, message: `Must be ≤ ${rule.max}.` })
      return n
    }
    case "number": {
      const n = Number(value)
      if (!Number.isFinite(n)) { issues.push({ path, message: "Must be a number." }); return undefined }
      if (rule.min != null && n < rule.min) issues.push({ path, message: `Must be ≥ ${rule.min}.` })
      if (rule.max != null && n > rule.max) issues.push({ path, message: `Must be ≤ ${rule.max}.` })
      return n
    }
    case "boolean": {
      if (typeof value === "boolean") return value
      if (value === "true") return true
      if (value === "false") return false
      issues.push({ path, message: "Must be a boolean." })
      return undefined
    }
    case "date": {
      const d = new Date(String(value))
      if (Number.isNaN(d.getTime())) { issues.push({ path, message: "Must be a valid date." }); return undefined }
      if (rule.futureDate && d.getTime() < Date.now() - 24 * 3600_000) {
        issues.push({ path, message: "Must be a future date." })
        return undefined
      }
      return d.toISOString()
    }
    case "array": {
      if (!Array.isArray(value)) { issues.push({ path, message: "Must be an array." }); return undefined }
      const out: unknown[] = []
      value.forEach((item, i) => {
        const v = validateRule(item, rule.itemRule!, `${path}[${i}]`, issues)
        if (v !== undefined) out.push(v)
      })
      if (rule.min != null && out.length < rule.min) issues.push({ path, message: `Min ${rule.min} items.` })
      if (rule.max != null && out.length > rule.max) issues.push({ path, message: `Max ${rule.max} items.` })
      return out
    }
    case "object": {
      if (!value || typeof value !== "object") { issues.push({ path, message: "Must be an object." }); return undefined }
      return validateObject(value as Record<string, unknown>, rule.shape!, path, issues)
    }
  }
}

function validateObject(
  obj: Record<string, unknown>,
  shape: Record<string, Rule>,
  basePath: string,
  issues: ValidationIssue[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  // Reject unknown keys.
  for (const k of Object.keys(obj)) {
    if (!(k in shape)) issues.push({ path: basePath ? `${basePath}.${k}` : k, message: "Unknown field." })
  }
  for (const [k, rule] of Object.entries(shape)) {
    const path = basePath ? `${basePath}.${k}` : k
    const v = validateRule(obj[k], rule, path, issues)
    if (v !== undefined) out[k] = v
  }
  return out
}

export function validateBody<T>(
  body: unknown,
  shape: Record<string, Rule>,
): ValidationResult<T> {
  const issues: ValidationIssue[] = []
  if (!body || typeof body !== "object") {
    return { ok: false, issues: [{ path: "", message: "Body must be a JSON object." }] }
  }
  const out = validateObject(body as Record<string, unknown>, shape, "", issues)
  if (issues.length) return { ok: false, issues }
  return { ok: true, value: out as T }
}

export function issuesToFields(issues: ValidationIssue[]): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const i of issues) {
    if (!i.path) continue
    if (!fields[i.path]) fields[i.path] = i.message
  }
  return fields
}

// Best-effort phone normalizer to E.164 (no external lib).
// Accepts inputs like "+201200000000", "01200000000", "0020 1200 000 000",
// "00966501234567" — strips spaces/dashes, keeps leading +.
export function normalizePhone(raw: string): string {
  let s = String(raw).trim().replace(/[\s\-()]/g, "")
  if (s.startsWith("00")) s = "+" + s.slice(2)
  // Egyptian local mobile (0XXXXXXXXXX) → +20…
  if (/^0\d{9,10}$/.test(s)) s = "+20" + s.slice(1)
  if (!s.startsWith("+")) s = "+" + s
  return s
}

// Honeypot helper. If the body contains a `company_url` field with a value,
// treat it as a bot submission.
export function honeypotTriggered(body: unknown): boolean {
  if (!body || typeof body !== "object") return false
  const v = (body as Record<string, unknown>)["company_url"]
  return typeof v === "string" && v.trim().length > 0
}
