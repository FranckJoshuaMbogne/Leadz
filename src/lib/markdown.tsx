import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { slugify } from "./utils";

/**
 * A deliberately small Markdown renderer for Insights articles.
 *
 * It outputs React elements (never raw HTML), so content stored in the CMS
 * cannot inject scripts. Supported: ## / ### headings, paragraphs, - and 1.
 * lists, > quotes, --- rules, ![alt](src) images, **bold**, *italic*,
 * `code` and [links](url).
 */

type Block =
  | { type: "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "hr" }
  | { type: "img"; alt: string; src: string };

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];

  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    if (list) blocks.push(list);
    if (quote.length) blocks.push({ type: "quote", text: quote.join(" ") });
    para = [];
    list = null;
    quote = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      flush();
      // A single "#" inside an article is treated as h2 — the page owns the h1.
      blocks.push({ type: m[1].length === 3 ? "h3" : "h2", text: m[2] });
    } else if (/^(-{3,}|\*{3,})$/.test(line)) {
      flush();
      blocks.push({ type: "hr" });
    } else if ((m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/))) {
      flush();
      blocks.push({ type: "img", alt: m[1], src: m[2] });
    } else if ((m = line.match(/^[-*]\s+(.*)$/))) {
      if (para.length || quote.length || (list && list.type !== "ul")) flush();
      list = list ?? { type: "ul", items: [] };
      list.items.push(m[1]);
    } else if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
      if (para.length || quote.length || (list && list.type !== "ol")) flush();
      list = list ?? { type: "ol", items: [] };
      list.items.push(m[1]);
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      if (para.length || list) flush();
      quote.push(m[1]);
    } else if (list && /^\s{2,}/.test(raw)) {
      list.items[list.items.length - 1] += ` ${line}`;
    } else {
      if (list || quote.length) flush();
      para.push(line);
    }
  }
  flush();
  return blocks;
}

const SAFE_URL = /^(https?:\/\/|\/|#|mailto:|tel:)/i;

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[2]) out.push(<strong key={k}>{m[2]}</strong>);
    else if (m[3]) out.push(<em key={k}>{m[3]}</em>);
    else if (m[4]) out.push(<code key={k}>{m[4]}</code>);
    else if (m[5] && m[6]) {
      const href = m[6];
      if (!SAFE_URL.test(href)) out.push(m[5]);
      else if (href.startsWith("/")) out.push(<Link key={k} to={href}>{m[5]}</Link>);
      else
        out.push(
          <a key={k} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {m[5]}
          </a>
        );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function headingsOf(src: string) {
  return parseMarkdown(src)
    .filter((b): b is { type: "h2"; text: string } => b.type === "h2")
    .map((b) => ({ id: slugify(b.text), text: b.text.replace(/[*`]/g, "") }));
}

export function Markdown({ source }: { source: string }) {
  const blocks = parseMarkdown(source);
  return (
    <>
      {blocks.map((b, i) => {
        const k = `b${i}`;
        switch (b.type) {
          case "h2":
            return (
              <h2 key={k} id={slugify(b.text)} className="scroll-mt-28">
                {renderInline(b.text, k)}
              </h2>
            );
          case "h3":
            return <h3 key={k}>{renderInline(b.text, k)}</h3>;
          case "p":
            return <p key={k}>{renderInline(b.text, k)}</p>;
          case "ul":
            return (
              <ul key={k}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it, `${k}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={k}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it, `${k}-${j}`)}</li>
                ))}
              </ol>
            );
          case "quote":
            return <blockquote key={k}>{renderInline(b.text, k)}</blockquote>;
          case "hr":
            return <hr key={k} />;
          case "img":
            return SAFE_URL.test(b.src) ? (
              <figure key={k}>
                <img src={b.src} alt={b.alt} loading="lazy" decoding="async" className="w-full rounded" />
                {b.alt && <figcaption className="mt-3 text-sm text-ink-soft">{b.alt}</figcaption>}
              </figure>
            ) : (
              <Fragment key={k} />
            );
        }
      })}
    </>
  );
}
