// Tiny HTML sanitizer with a strict allowlist for blog bodies.
// Avoids adding a new runtime dep; sufficient for our trusted CMS content.

const ALLOWED_TAGS = new Set([
  "p", "h2", "h3", "h4", "ul", "ol", "li", "a", "strong", "em",
  "blockquote", "img", "code", "pre", "br", "hr",
])
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "rel", "target"]),
  img: new Set(["src", "alt", "title", "width", "height"]),
}
const URL_ATTRS = new Set(["href", "src"])

function isSafeUrl(u: string): boolean {
  const v = u.trim().toLowerCase()
  if (v.startsWith("http://") || v.startsWith("https://")) return true
  if (v.startsWith("mailto:") || v.startsWith("tel:")) return true
  if (v.startsWith("/")) return true
  if (v.startsWith("#")) return true
  return false
}

function sanitizeAttrs(tag: string, raw: string): string {
  const allowed = ALLOWED_ATTRS[tag]
  if (!allowed) return ""
  const attrs: string[] = []
  // crude attribute regex
  const re = /([a-zA-Z_:][a-zA-Z0-9_:.-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g
  let m: RegExpExecArray | null
  while ((m = re.exec(raw))) {
    const name = m[1].toLowerCase()
    if (!allowed.has(name)) continue
    let val = m[3] ?? m[4] ?? m[5] ?? ""
    if (URL_ATTRS.has(name) && !isSafeUrl(val)) continue
    val = val.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    attrs.push(`${name}="${val}"`)
  }
  if (tag === "a" && attrs.some((a) => a.startsWith('target="_blank"'))) {
    attrs.push('rel="noopener noreferrer"')
  }
  return attrs.length ? " " + attrs.join(" ") : ""
}

export function sanitizeHtml(input: string): string {
  if (!input) return ""
  return input.replace(
    /<\/?\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
    (_full, tag: string, rest: string) => {
      const lower = tag.toLowerCase()
      const isClose = _full.trim().startsWith("</")
      if (!ALLOWED_TAGS.has(lower)) return ""
      if (isClose) return `</${lower}>`
      const cleanedAttrs = sanitizeAttrs(lower, rest)
      const selfClosing = lower === "br" || lower === "hr" || lower === "img"
      return selfClosing ? `<${lower}${cleanedAttrs} />` : `<${lower}${cleanedAttrs}>`
    },
  )
}

// Convert Lexical (Payload v3) richText to HTML — minimal subset covering
// the tags we allow above. Falls back to text-only when unknown.
type LexNode = {
  type?: string
  tag?: string | number
  text?: string
  format?: number
  url?: string
  children?: LexNode[]
  fields?: { url?: string; newTab?: boolean }
  listType?: "bullet" | "number"
}

const FMT_BOLD = 1
const FMT_ITALIC = 2
const FMT_CODE = 16

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function renderInline(node: LexNode): string {
  if (node.type === "text" || typeof node.text === "string") {
    let t = escape(node.text || "")
    const f = node.format || 0
    if (f & FMT_CODE) t = `<code>${t}</code>`
    if (f & FMT_BOLD) t = `<strong>${t}</strong>`
    if (f & FMT_ITALIC) t = `<em>${t}</em>`
    return t
  }
  if (node.type === "linebreak") return "<br />"
  if (node.type === "link" || node.type === "autolink") {
    const url = node.fields?.url || node.url || "#"
    if (!isSafeUrl(url)) return (node.children || []).map(renderInline).join("")
    const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ""
    return `<a href="${escape(url)}"${target}>${(node.children || []).map(renderInline).join("")}</a>`
  }
  return (node.children || []).map(renderInline).join("")
}

function renderBlock(node: LexNode): string {
  switch (node.type) {
    case "paragraph":
      return `<p>${(node.children || []).map(renderInline).join("")}</p>`
    case "heading": {
      const tag = String(node.tag || "h2").toLowerCase()
      const safe = ["h2", "h3", "h4"].includes(tag) ? tag : "h2"
      return `<${safe}>${(node.children || []).map(renderInline).join("")}</${safe}>`
    }
    case "list": {
      const t = node.listType === "number" ? "ol" : "ul"
      return `<${t}>${(node.children || []).map(renderBlock).join("")}</${t}>`
    }
    case "listitem":
      return `<li>${(node.children || []).map((c) => (c.type === "paragraph" ? (c.children || []).map(renderInline).join("") : renderBlock(c))).join("")}</li>`
    case "quote":
      return `<blockquote>${(node.children || []).map(renderBlock).join("")}</blockquote>`
    case "code":
      return `<pre><code>${(node.children || []).map(renderInline).join("")}</code></pre>`
    case "horizontalrule":
      return "<hr />"
    default:
      if (node.children) return (node.children || []).map(renderBlock).join("")
      return ""
  }
}

export function lexicalToHtml(rt: unknown): string {
  if (!rt) return ""
  const root = (rt as { root?: LexNode }).root
  if (!root || !root.children) return ""
  const html = root.children.map(renderBlock).join("")
  return sanitizeHtml(html)
}
