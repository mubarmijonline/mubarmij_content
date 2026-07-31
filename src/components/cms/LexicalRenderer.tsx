import type { ReactNode } from "react";

/**
 * Minimal Lexical (Payload v3) richText → React renderer.
 * Handles paragraphs, headings, lists, quotes, links, and basic text formatting
 * (bold/italic/underline/strikethrough/code). Unknown nodes are rendered
 * as their children so we never crash on shapes we haven't whitelisted.
 */

type LexNode = {
  type?: string;
  tag?: string;
  text?: string;
  format?: number | string;
  url?: string;
  fields?: { url?: string; newTab?: boolean };
  newTab?: boolean;
  listType?: "bullet" | "number" | string;
  children?: LexNode[];
};

type LexRoot = { root?: { children?: LexNode[] } };

const FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
};

function renderText(node: LexNode, key: number): ReactNode {
  let el: ReactNode = node.text ?? "";
  const f = typeof node.format === "number" ? node.format : 0;
  if (f & FORMAT.CODE) el = <code className="px-1 py-0.5 rounded bg-paper-subtle text-fg">{el}</code>;
  if (f & FORMAT.UNDERLINE) el = <u>{el}</u>;
  if (f & FORMAT.STRIKETHROUGH) el = <s>{el}</s>;
  if (f & FORMAT.ITALIC) el = <em>{el}</em>;
  if (f & FORMAT.BOLD) el = <strong>{el}</strong>;
  return <span key={key}>{el}</span>;
}

function renderChildren(children: LexNode[] | undefined): ReactNode {
  if (!children || children.length === 0) return null;
  return children.map((child, i) => renderNode(child, i));
}

function renderNode(node: LexNode, key: number): ReactNode {
  if (!node) return null;

  // Text node
  if (node.type === "text" || (typeof node.text === "string" && !node.type)) {
    return renderText(node, key);
  }

  // Line break
  if (node.type === "linebreak") return <br key={key} />;

  // Headings
  if (node.type === "heading") {
    const tag = (node.tag || "h2").toLowerCase();
    const cls =
      tag === "h1"
        ? "font-display text-3xl md:text-4xl font-extrabold text-fg mt-8 mb-4"
        : tag === "h2"
        ? "font-display text-2xl md:text-3xl font-bold text-fg mt-7 mb-3"
        : "font-display text-xl md:text-2xl font-bold text-fg mt-6 mb-3";
    const Tag = tag as keyof JSX.IntrinsicElements;
    return <Tag key={key} className={cls}>{renderChildren(node.children)}</Tag>;
  }

  // Lists
  if (node.type === "list") {
    const ordered = node.listType === "number";
    const cls = ordered
      ? "list-decimal pl-6 rtl:pr-6 rtl:pl-0 my-4 space-y-1.5 text-fg/85"
      : "list-disc pl-6 rtl:pr-6 rtl:pl-0 my-4 space-y-1.5 text-fg/85";
    if (ordered) return <ol key={key} className={cls}>{renderChildren(node.children)}</ol>;
    return <ul key={key} className={cls}>{renderChildren(node.children)}</ul>;
  }
  if (node.type === "listitem") {
    return <li key={key}>{renderChildren(node.children)}</li>;
  }

  // Block quote
  if (node.type === "quote") {
    return (
      <blockquote
        key={key}
        className="border-l-4 rtl:border-l-0 rtl:border-r-4 border-gold pl-4 rtl:pr-4 rtl:pl-0 my-5 text-fg/80 italic"
      >
        {renderChildren(node.children)}
      </blockquote>
    );
  }

  // Link
  if (node.type === "link") {
    const url = node.fields?.url || node.url || "#";
    const newTab = node.fields?.newTab ?? node.newTab ?? false;
    return (
      <a
        key={key}
        href={url}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className="text-gold underline decoration-gold/40 hover:decoration-gold underline-offset-4"
      >
        {renderChildren(node.children)}
      </a>
    );
  }

  // Paragraph (default block)
  if (node.type === "paragraph" || !node.type) {
    return (
      <p key={key} className="my-4 leading-relaxed text-fg/85 text-base md:text-lg">
        {renderChildren(node.children)}
      </p>
    );
  }

  // Fallback: render children
  return <span key={key}>{renderChildren(node.children)}</span>;
}

export default function LexicalRenderer({ value }: { value: unknown }) {
  if (!value || typeof value !== "object") return null;
  const root = (value as LexRoot).root;
  if (!root || !Array.isArray(root.children)) return null;
  return <div className="cms-rich">{root.children.map((c, i) => renderNode(c, i))}</div>;
}
