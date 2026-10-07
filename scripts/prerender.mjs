/**
 * Build-time prerendering.
 *
 * After `vite build` (client) and `vite build --ssr` (server bundle), this
 * renders every public route to static HTML with page-specific <head> tags,
 * so crawlers and social previews see real content and metadata. It also
 * writes sitemap.xml, robots.txt, a SPA shell (app.html) and 404.html.
 *
 * Published Insights from the Firestore CMS are fetched (public REST read)
 * and prerendered too. If Firestore is unreachable the build continues with
 * the built-in articles only.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const server = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const { render, site, staticInsights, services, pillars, caseStudies, industries, docToInsight } = server;

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");

/* ---------------------------------------------------------------- */
/* CMS                                                               */
/* ---------------------------------------------------------------- */

function fromFirestoreValue(v) {
  if (!v) return undefined;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("nullValue" in v) return null;
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(fromFirestoreValue);
  if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, fromFirestoreValue(x)]));
  return undefined;
}

async function fetchCmsInsights() {
  if (process.env.PRERENDER_CMS === "false") return [];
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "leadzindb";
  const apiKey = process.env.VITE_FIREBASE_API_KEY || "AIzaSyBmf_mejrKZrC4WVn6JLQMWXgPh1kNnaX8";
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "insights" }],
          where: { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } } },
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    const today = new Date().toISOString().slice(0, 10);
    const items = rows
      .filter((r) => r.document)
      .map((r) => docToInsight(fromFirestoreValue({ mapValue: { fields: r.document.fields } })))
      .filter((i) => i.slug && i.title && i.publishedAt.slice(0, 10) <= today);
    console.log(`  CMS: ${items.length} published insight(s)`);
    return items;
  } catch (err) {
    console.warn(`  CMS: skipped (${err.message}). Built-in articles only.`);
    return [];
  }
}

const cms = await fetchCmsInsights();

/* ---------------------------------------------------------------- */
/* Routes                                                            */
/* ---------------------------------------------------------------- */

const insightSlugs = Array.from(new Set([...staticInsights.map((i) => i.slug), ...cms.map((i) => i.slug)]));
const lastmod = new Map(
  [...staticInsights, ...cms].map((i) => [`/insights/${i.slug}`, (i.updatedAt || i.publishedAt).slice(0, 10)])
);

const routes = [
  { path: "/", priority: 1.0 },
  { path: "/services", priority: 0.9 },
  ...pillars.map((p) => ({ path: `/services/${p.slug}`, priority: 0.8 })),
  ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.7 })),
  { path: "/work", priority: 0.8 },
  ...caseStudies.map((c) => ({ path: `/work/${c.slug}`, priority: 0.6 })),
  { path: "/industries", priority: 0.7 },
  ...industries.map((i) => ({ path: `/industries/${i.slug}`, priority: 0.6 })),
  { path: "/insights", priority: 0.8 },
  ...insightSlugs.map((s) => ({ path: `/insights/${s}`, priority: 0.7 })),
  { path: "/about", priority: 0.7 },
  { path: "/book", priority: 0.8 },
  { path: "/contact", priority: 0.6 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
  { path: "/thank-you", noindex: true },
  { path: "/404", noindex: true, file: "404.html" },
];

/* ---------------------------------------------------------------- */
/* Font preloads (latin subsets used above the fold)                 */
/* ---------------------------------------------------------------- */

const assets = await fs.readdir(path.join(dist, "assets"));
const preloadFonts = assets
  .filter((f) => /^(bodoni-moda-latin-opsz-(normal|italic)|dm-sans-latin-wght-normal)-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join("\n    ");

function cmsPayload(routePath) {
  if (!cms.length) return "";
  const usesInsights = routePath === "/" || routePath.startsWith("/insights");
  if (!usesInsights) return "";
  const current = routePath.startsWith("/insights/") ? routePath.split("/")[2] : null;
  const data = cms.map((i) => (i.slug === current ? i : { ...i, content: "" }));
  return `<script id="__CMS_INSIGHTS__" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function fill(head, html, data) {
  return template
    .replace("<!--app-head-->", `${preloadFonts}\n    ${head}`)
    .replace("<!--app-html-->", html)
    .replace("<!--app-data-->", data);
}

let count = 0;
for (const r of routes) {
  // Article pages need their own CMS content available during render.
  const { html, head, status } = await render(r.path, cms);
  if (status !== 200 && !r.noindex) throw new Error(`Route ${r.path} rendered with status ${status}`);
  const file = r.file ?? (r.path === "/" ? "index.html" : `${r.path.slice(1)}.html`);
  const out = path.join(dist, file);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, fill(head, html, cmsPayload(r.path)));
  count++;
}

// SPA shell for client-only routes (admin, CMS articles newer than the last build).
await fs.writeFile(
  path.join(dist, "app.html"),
  template
    .replace("<!--app-head-->", `${preloadFonts}\n    <title>${site.name}</title>\n    <meta name="robots" content="noindex">`)
    .replace("<!--app-html-->", "")
    .replace("<!--app-data-->", "")
);

/* ---------------------------------------------------------------- */
/* sitemap.xml + robots.txt                                          */
/* ---------------------------------------------------------------- */

const buildDate = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((r) => !r.noindex)
  .map(
    (r) => `  <url>
    <loc>${site.url}${r.path === "/" ? "/" : r.path}</loc>
    <lastmod>${lastmod.get(r.path) ?? buildDate}</lastmod>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);

await fs.writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /thank-you

Sitemap: ${site.url}/sitemap.xml
`
);

await fs.rm(ssrDir, { recursive: true, force: true });
console.log(`  Prerendered ${count} routes, sitemap.xml and robots.txt for ${site.url}`);
