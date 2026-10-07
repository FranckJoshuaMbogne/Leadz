import { createContext, useContext, useEffect, type ReactNode } from "react";
import { absoluteUrl, site } from "@/config/site";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface SeoProps {
  /** Page title without the brand suffix. */
  title: string;
  description: string;
  /** Path of the canonical URL, e.g. "/insights/my-article". */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

export interface HeadTag {
  tag: "title" | "meta" | "link" | "script";
  attrs: Record<string, string>;
  text?: string;
}

/* ------------------------------------------------------------------ */
/* Tag generation (shared by the prerenderer and the browser)          */
/* ------------------------------------------------------------------ */

export function fullTitle(title: string) {
  return title.includes(site.name) ? title : `${title} — ${site.name}`;
}

export function buildHeadTags(p: SeoProps): HeadTag[] {
  const title = fullTitle(p.title);
  const url = absoluteUrl(p.path);
  const image = absoluteUrl(p.image || site.defaultOgImage);
  const tags: HeadTag[] = [
    { tag: "title", attrs: {}, text: title },
    { tag: "meta", attrs: { name: "description", content: p.description } },
    { tag: "link", attrs: { rel: "canonical", href: url } },
    { tag: "meta", attrs: { name: "robots", content: p.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large" } },
    { tag: "meta", attrs: { property: "og:site_name", content: site.name } },
    { tag: "meta", attrs: { property: "og:locale", content: site.locale } },
    { tag: "meta", attrs: { property: "og:type", content: p.type ?? "website" } },
    { tag: "meta", attrs: { property: "og:title", content: title } },
    { tag: "meta", attrs: { property: "og:description", content: p.description } },
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:image:alt", content: p.imageAlt ?? title } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: title } },
    { tag: "meta", attrs: { name: "twitter:description", content: p.description } },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
  ];

  if (p.type === "article" && p.article) {
    const a = p.article;
    if (a.publishedTime) tags.push({ tag: "meta", attrs: { property: "article:published_time", content: a.publishedTime } });
    if (a.modifiedTime) tags.push({ tag: "meta", attrs: { property: "article:modified_time", content: a.modifiedTime } });
    if (a.section) tags.push({ tag: "meta", attrs: { property: "article:section", content: a.section } });
    a.tags?.forEach((t) => tags.push({ tag: "meta", attrs: { property: "article:tag", content: t } }));
  }

  p.jsonLd?.forEach((ld) =>
    tags.push({
      tag: "script",
      attrs: { type: "application/ld+json" },
      // Escape "<" so content can never close the script element.
      text: JSON.stringify(ld).replace(/</g, "\\u003c"),
    })
  );

  return tags;
}

function escapeAttr(v: string) {
  return v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeText(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function headTagsToString(tags: HeadTag[]) {
  return tags
    .map(({ tag, attrs, text }) => {
      const a = Object.entries({ ...attrs, "data-seo": "" })
        .map(([k, v]) => (v === "" ? k : `${k}="${escapeAttr(v)}"`))
        .join(" ");
      if (tag === "meta" || tag === "link") return `<${tag} ${a}>`;
      const body = tag === "script" ? text ?? "" : escapeText(text ?? "");
      return `<${tag} ${a}>${body}</${tag}>`;
    })
    .join("\n    ");
}

function applyHeadTags(tags: HeadTag[]) {
  const head = document.head;
  head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
  // Remove any un-managed duplicates left in the template.
  head.querySelectorAll('meta[name="description"], link[rel="canonical"]').forEach((el) => el.remove());
  for (const t of tags) {
    if (t.tag === "title") {
      document.title = t.text ?? "";
      continue;
    }
    const el = document.createElement(t.tag);
    Object.entries(t.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.setAttribute("data-seo", "");
    if (t.text) el.textContent = t.text;
    head.appendChild(el);
  }
}

/* ------------------------------------------------------------------ */
/* React integration                                                   */
/* ------------------------------------------------------------------ */

export interface HeadCollector {
  data?: SeoProps;
  status?: number;
}

const HeadContext = createContext<HeadCollector | null>(null);

export function HeadProvider({ collector, children }: { collector?: HeadCollector; children: ReactNode }) {
  return <HeadContext.Provider value={collector ?? null}>{children}</HeadContext.Provider>;
}

/** Declares page metadata. Rendered into static HTML at build time and kept in sync in the browser. */
export function Seo(props: SeoProps & { status?: number }) {
  const collector = useContext(HeadContext);
  if (collector && typeof window === "undefined") {
    collector.data = props;
    if (props.status) collector.status = props.status;
  }

  const key = JSON.stringify(props);
  useEffect(() => {
    applyHeadTags(buildHeadTags(props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}

/* ------------------------------------------------------------------ */
/* Structured data helpers                                             */
/* ------------------------------------------------------------------ */

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/favicon.svg"),
  description: site.description,
  ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
  ...(site.contact.phoneDisplay
    ? {
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: site.contact.phoneHref.replace("tel:", ""),
          ...(site.contact.email ? { email: site.contact.email } : {}),
        },
      }
    : {}),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  publisher: { "@id": `${site.url}/#organization` },
});

export const professionalServiceLd = (opts: { name?: string; description?: string; path?: string; serviceTypes?: string[] } = {}) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: opts.name ?? site.name,
  description: opts.description ?? site.description,
  url: absoluteUrl(opts.path ?? "/"),
  provider: { "@id": `${site.url}/#organization` },
  ...(site.contact.phoneDisplay ? { telephone: site.contact.phoneHref.replace("tel:", "") } : {}),
  ...(opts.serviceTypes ? { serviceType: opts.serviceTypes } : {}),
  image: absoluteUrl(site.defaultOgImage),
});

export const serviceLd = (opts: { name: string; description: string; path: string; category?: string }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: opts.name,
  description: opts.description,
  url: absoluteUrl(opts.path),
  provider: { "@id": `${site.url}/#organization` },
  ...(opts.category ? { category: opts.category } : {}),
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const faqLd = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

export const articleLd = (a: {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  mainEntityOfPage: absoluteUrl(a.path),
  image: absoluteUrl(a.image || site.defaultOgImage),
  datePublished: a.publishedAt,
  dateModified: a.updatedAt ?? a.publishedAt,
  articleSection: a.category,
  author: a.author.includes(site.name)
    ? { "@type": "Organization", name: a.author, url: site.url }
    : { "@type": "Person", name: a.author },
  publisher: { "@id": `${site.url}/#organization` },
});
