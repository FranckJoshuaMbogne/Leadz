import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { useContent } from "@/content/ContentProvider";
import { builtInPages, templates } from "@/landing/defaults";
import type { Course, LandingPage, Template } from "@/landing/types";
import { cn, slugify } from "@/lib/utils";
import { FieldsForm, inputCls, type Field } from "./fields";
import { deletePage, listCoursesAdmin, listPages, pageExists, savePage } from "./landingApi";

/** URLs already used by the website. */
const RESERVED = new Set(["services", "work", "industries", "insights", "about", "book", "contact", "thank-you", "privacy", "terms", "portfolio", "pricing", "404", "admin", "dashboard", "courses", "learn", "media", "assets", "og", "images", "app", "sitemap", "robots", "index"]);

type Row = LandingPage & { updatedAt?: Date; builtIn?: boolean };

/* ------------------------------------------------------------------ */
/* Field schemas                                                       */
/* ------------------------------------------------------------------ */

const generalFields: Field[] = [
  { k: "name", label: "Page name (admin only)", type: "text" },
  { k: "slug", label: "URL", type: "text", hint: "springs360.in/<this>. Lowercase letters, numbers and dashes, e.g. audit, training, free-website-review." },
  {
    k: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "published", label: "Published (live)" },
      { value: "draft", label: "Draft (hidden, admin preview only)" },
    ],
  },
  { k: "tag", label: "Label at the top right", type: "text", placeholder: "Free growth audit" },
  { k: "whatsapp", label: "Show a floating WhatsApp button", type: "bool", hint: "Uses the WhatsApp number from Hero, contact & links." },
  { k: "seoTitle", label: "Google / share title", type: "text", hint: "Shown in Google and when the link is shared on WhatsApp." },
  { k: "seoDescription", label: "Google / share description", type: "textarea" },
  { k: "ogImage", label: "Share image", type: "image", hint: "1200×630 works best. Shown when the link is shared." },
];

const heroFields: Field[] = [
  {
    k: "hero",
    label: "Hero (top of the page)",
    type: "group",
    fields: [
      { k: "eyebrow", label: "Small line above the headline", type: "text" },
      { k: "headline", label: "Headline", type: "textarea", hint: "Wrap words in *asterisks* to set them in gold italic." },
      { k: "text", label: "Sub-headline", type: "textarea" },
      { k: "ctaLabel", label: "Main button text", type: "text" },
      { k: "ctaNote", label: "Note next to the button", type: "text" },
      { k: "chips", label: "Reassurance points", type: "tags", hint: "Short points under the button. Press Enter after each." },
      { k: "image", label: "Image on the right (optional)", type: "image" },
      { k: "video", label: "Video on the right (optional)", type: "url", hint: "YouTube, Vimeo, Google Drive or .mp4 link. Replaces the image." },
    ],
  },
];

const sectionFields: Field[] = [
  {
    k: "sections",
    label: "Sections (in page order)",
    type: "list",
    addLabel: "Add section",
    itemTitle: (s) => `${kindLabel[s.kind as string] ?? s.kind} · ${(s.title || "").replace(/\*/g, "")}`,
    newItem: () => ({ kind: "list", eyebrow: "", title: "", text: "", items: [{ title: "", text: "" }] }),
    fields: [
      {
        k: "kind",
        label: "Layout",
        type: "select",
        options: [
          { value: "cards", label: "Cards (features, pillars)" },
          { value: "list", label: "Two-column list (what you get)" },
          { value: "steps", label: "Numbered steps (how it works)" },
          { value: "chips", label: "Tags (who it's for)" },
          { value: "faq", label: "FAQ (item title = question)" },
          { value: "testimonials", label: "Testimonials (title = name, text = quote)" },
          { value: "text", label: "Plain text" },
        ],
      },
      { k: "eyebrow", label: "Small label", type: "text" },
      { k: "title", label: "Title", type: "text", hint: "*Asterisks* = accent words." },
      { k: "text", label: "Intro text", type: "textarea" },
      {
        k: "items",
        label: "Items",
        type: "list",
        addLabel: "Add item",
        hint: "On a quiz page, leave the cards empty to show the quiz pillars.",
        itemTitle: (x) => x.title || x.text?.slice(0, 40) || "",
        newItem: () => ({ title: "", text: "" }),
        fields: [
          { k: "title", label: "Title", type: "text" },
          { k: "text", label: "Text", type: "textarea" },
        ],
      },
    ],
  },
];
const kindLabel: Record<string, string> = { cards: "Cards", list: "List", steps: "Steps", chips: "Tags", faq: "FAQ", testimonials: "Testimonials", text: "Text" };

const finalFields: Field[] = [
  {
    k: "final",
    label: "Closing call to action",
    type: "group",
    fields: [
      { k: "title", label: "Headline", type: "text" },
      { k: "text", label: "Text", type: "textarea" },
      { k: "ctaLabel", label: "Button text", type: "text" },
    ],
  },
];

function quizFields(page: LandingPage): Field[] {
  const pillarOpts = page.quiz.pillars.map((p) => ({ value: p.key, label: p.name || p.key }));
  return [
    {
      k: "quiz",
      label: "Quiz",
      type: "group",
      hint: "Each answer scores Yes = 10, Partly = 5, No = 0. The score out of 100 is the total across all questions.",
      fields: [
        {
          k: "pillars",
          label: "Pillars (what you score)",
          type: "list",
          addLabel: "Add pillar",
          itemTitle: (p) => p.name,
          newItem: () => ({ key: `p${Math.random().toString(36).slice(2, 6)}`, name: "", short: "", description: "", fix: "", example: 50 }),
          fields: [
            { k: "name", label: "Name", type: "text" },
            { k: "short", label: "Short name (score bars)", type: "text" },
            { k: "description", label: "Description", type: "textarea" },
            { k: "fix", label: "Advice when this pillar is weak", type: "textarea" },
            { k: "example", label: "Score on the example card (0–100)", type: "number" },
          ],
        },
        {
          k: "questions",
          label: "Questions",
          type: "list",
          addLabel: "Add question",
          itemTitle: (q) => q.question,
          newItem: () => ({ pillar: pillarOpts[0]?.value ?? "", question: "", why: "" }),
          fields: [
            { k: "pillar", label: "Pillar", type: "select", options: [{ value: "", label: "Choose…" }, ...pillarOpts] },
            { k: "question", label: "Question (answered Yes / Partly / No)", type: "textarea" },
            { k: "why", label: "Why it matters (small text)", type: "textarea" },
          ],
        },
        { k: "exampleName", label: "Example card: business name", type: "text" },
        { k: "exampleSubtitle", label: "Example card: subtitle", type: "text" },
        { k: "exampleNote", label: "Example card: bottleneck note", type: "textarea" },
        { k: "formTitle", label: "Result form title", type: "text" },
        { k: "formText", label: "Result form text", type: "textarea" },
        { k: "businessTypes", label: "Business types (dropdown)", type: "tags", hint: "Leave empty to hide the dropdown." },
        { k: "areaLabel", label: "Area field label", type: "text", hint: "Leave empty to hide the field." },
        { k: "doneText", label: "Thank-you message", type: "textarea" },
      ],
    },
  ];
}

const formFields: Field[] = [
  {
    k: "form",
    label: "Lead form (right side of the hero)",
    type: "group",
    fields: [
      { k: "title", label: "Title", type: "text" },
      { k: "text", label: "Text", type: "textarea" },
      { k: "askEmail", label: "Ask for email (optional field)", type: "bool" },
      { k: "askCompany", label: "Ask for business name", type: "bool" },
      { k: "messageLabel", label: "Message field label", type: "text", hint: "Leave empty to hide the message box." },
      { k: "buttonLabel", label: "Button text", type: "text" },
      { k: "doneText", label: "Thank-you message", type: "textarea" },
    ],
  },
];

const coursesFields: Field[] = [
  {
    k: "courses",
    label: "Course list",
    type: "group",
    fields: [
      { k: "eyebrow", label: "Small label", type: "text" },
      { k: "title", label: "Title", type: "text", hint: "*Asterisks* = accent words." },
      { k: "text", label: "Intro text", type: "textarea" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

type SubTab = "general" | "hero" | "module" | "sections" | "final";

function Editor({ initial, isNew, onDone }: { initial: Row; isNew: boolean; onDone: () => void }) {
  const content = useContent();
  const [page, setPage] = useState<LandingPage>(() => {
    const { updatedAt: _u, builtIn: _b, ...p } = initial;
    return p;
  });
  const [prevSlug, setPrevSlug] = useState(initial.builtIn || isNew ? undefined : initial.slug);
  const [sub, setSub] = useState<SubTab>("general");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saved, setSaved] = useState(!isNew && !initial.builtIn);
  const [courses, setCourses] = useState<Course[]>([]);
  const [base, setBase] = useState<LandingPage | null>(() => (isNew || initial.builtIn ? null : page));
  const dirty = useMemo(() => JSON.stringify(page) !== JSON.stringify(base), [page, base]);

  useEffect(() => {
    if (page.template === "courses") listCoursesAdmin().then(setCourses).catch(() => {});
  }, [page.template]);

  const moduleLabel = page.template === "audit" ? "Quiz" : page.template === "courses" ? "Courses" : "Form";
  const subTabs: { id: SubTab; label: string }[] = [
    { id: "general", label: "Page & SEO" },
    { id: "hero", label: "Hero" },
    { id: "module", label: moduleLabel },
    { id: "sections", label: "Sections" },
    { id: "final", label: "Closing" },
  ];

  async function save() {
    const slug = slugify(page.slug || page.name);
    if (!slug) return setMsg({ ok: false, text: "Give the page a URL, e.g. free-audit." });
    if (RESERVED.has(slug)) return setMsg({ ok: false, text: `“${slug}” is already used by the website. Choose another URL.` });
    if (page.template === "audit") {
      const keys = new Set(page.quiz.pillars.map((p) => p.key));
      if (!page.quiz.questions.length) return setMsg({ ok: false, text: "Add at least one quiz question." });
      if (page.quiz.questions.some((q) => !keys.has(q.pillar))) return setMsg({ ok: false, text: "Every question needs a pillar. Check the Quiz tab." });
    }
    setBusy(true);
    setMsg(null);
    try {
      if (slug !== prevSlug && (await pageExists(slug)) && !(initial.builtIn && slug === initial.slug)) {
        setBusy(false);
        return setMsg({ ok: false, text: `Another page already uses springs360.in/${slug}.` });
      }
      const next = { ...page, slug };
      await savePage(next, prevSlug);
      setPage(next);
      setBase(next);
      setPrevSlug(slug);
      setSaved(true);
      setMsg({ ok: true, text: next.status === "published" ? `Saved. Live at springs360.in/${slug}` : "Saved as a draft. Use Preview to see it." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? `Could not save: ${e.message}` : "Could not save." });
    } finally {
      setBusy(false);
    }
  }

  const selected = page.courses.slugs;
  return (
    <div className="pb-24">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => (!dirty || window.confirm("Leave without saving?")) && onDone()} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-2 text-sm font-semibold hover:border-ink">
          <ArrowLeft size={15} /> All pages
        </button>
        <h2 className="mr-auto truncate text-xl font-bold text-ink">{page.name || "New page"}</h2>
        {saved && (
          <a href={`/${page.slug}${page.status === "published" ? "" : "?preview=1"}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-2 text-sm font-semibold hover:border-ink">
            <ExternalLink size={14} /> {page.status === "published" ? "View" : "Preview"}
          </a>
        )}
      </div>
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-full bg-white p-1">
        {subTabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setSub(t.id)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold", sub === t.id ? "bg-forest text-ivory" : "text-ink hover:bg-ink/5")}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        {sub === "general" && (
          <>
            <p className="mb-5 rounded-xl bg-sage-100 px-4 py-3 text-sm text-ink">
              Template: <b>{templates.find((t) => t.id === page.template)?.label}</b>. URL: <b>springs360.in/{slugify(page.slug) || "…"}</b>
            </p>
            <FieldsForm fields={generalFields} value={page} onChange={(v) => setPage(v as LandingPage)} content={content} />
          </>
        )}
        {sub === "hero" && <FieldsForm fields={heroFields} value={page} onChange={(v) => setPage(v as LandingPage)} content={content} />}
        {sub === "module" && page.template === "audit" && <FieldsForm fields={quizFields(page)} value={page} onChange={(v) => setPage(v as LandingPage)} content={content} />}
        {sub === "module" && page.template === "leadform" && <FieldsForm fields={formFields} value={page} onChange={(v) => setPage(v as LandingPage)} content={content} />}
        {sub === "module" && page.template === "courses" && (
          <div className="grid gap-6">
            <FieldsForm fields={coursesFields} value={page} onChange={(v) => setPage(v as LandingPage)} content={content} />
            <div>
              <p className="text-sm font-semibold text-ink">Courses to show</p>
              <p className="mb-2 text-xs text-ink-soft">Select none to show every published course (in the order set in Courses).</p>
              <div className="flex flex-wrap gap-2">
                {courses.length === 0 && <span className="text-sm text-ink-soft">No courses yet. Add them in the Courses tab.</span>}
                {courses.map((c) => {
                  const on = selected.includes(c.slug);
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPage({ ...page, courses: { ...page.courses, slugs: on ? selected.filter((s) => s !== c.slug) : [...selected, c.slug] } })}
                      className={cn("rounded-full border px-3 py-1.5 text-sm font-medium", on ? "border-forest bg-forest text-ivory" : "border-ink/15 bg-white text-ink hover:border-ink/40")}
                    >
                      {c.title}
                      {c.status !== "published" && " (draft)"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {sub === "sections" && <FieldsForm fields={sectionFields} value={page} onChange={(v) => setPage(v as LandingPage)} content={content} />}
        {sub === "final" && <FieldsForm fields={finalFields} value={page} onChange={(v) => setPage(v as LandingPage)} content={content} />}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur lg:pl-[17rem]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          {msg ? <p className={cn("text-sm font-semibold", msg.ok ? "text-emerald-700" : "text-[#9B2C2C]")}>{msg.text}</p> : <p className="text-sm text-ink-muted">{dirty ? "You have unsaved changes." : "No changes."}</p>}
          <button type="button" onClick={save} disabled={busy} className="ml-auto inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-sm font-semibold text-ivory hover:bg-deep disabled:opacity-60">
            {busy && <Loader2 size={15} className="animate-spin" />} Save page
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* List                                                                */
/* ------------------------------------------------------------------ */

function NewPage({ onCreate, onCancel }: { onCreate: (p: LandingPage) => void; onCancel: () => void }) {
  const [tpl, setTpl] = useState<Template>("leadform");
  const [slug, setSlug] = useState("");
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink">New landing page</h2>
      <p className="mt-1 text-sm text-ink-muted">Pick a starting template. Everything on it can be changed.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {templates.map((t) => (
          <button key={t.id} type="button" onClick={() => setTpl(t.id)} className={cn("rounded-2xl border-2 p-4 text-left", tpl === t.id ? "border-forest bg-forest/5" : "border-ink/10 hover:border-ink/30")}>
            <span className="block font-semibold text-ink">{t.label}</span>
            <span className="mt-1 block text-sm text-ink-muted">{t.text}</span>
          </button>
        ))}
      </div>
      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">URL</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-soft">springs360.in/</span>
          <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="free-website-review" />
        </div>
      </label>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => {
            const s = slugify(slug);
            const p = templates.find((t) => t.id === tpl)!.make(s);
            onCreate({ ...p, status: "draft", name: s ? s.replace(/-/g, " ") : p.name });
          }}
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-deep"
        >
          Create page
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold hover:border-ink">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function LandingPanel() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ row: Row; isNew: boolean } | null>(null);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    setError("");
    try {
      const saved = await listPages();
      const builtIns = Object.entries(builtInPages)
        .filter(([slug]) => !saved.some((p) => p.slug === slug))
        .map(([, make]) => ({ ...make(), builtIn: true }));
      setRows([...saved, ...builtIns].sort((a, b) => a.slug.localeCompare(b.slug)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load landing pages. Deploy the latest firestore.rules.");
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  if (editing)
    return (
      <Editor
        key={editing.row.slug + String(editing.isNew)}
        initial={editing.row}
        isNew={editing.isNew}
        onDone={() => {
          setEditing(null);
          refresh();
        }}
      />
    );

  return (
    <div className="grid gap-5">
      {creating ? (
        <NewPage
          onCancel={() => setCreating(false)}
          onCreate={(p) => {
            setCreating(false);
            setEditing({ row: p, isNew: true });
          }}
        />
      ) : (
        <button type="button" onClick={() => setCreating(true)} className="inline-flex w-fit items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-deep">
          <Plus size={16} /> New landing page
        </button>
      )}
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {!rows && !error && (
        <p className="flex items-center gap-2 text-ink-soft">
          <Loader2 size={18} className="animate-spin" /> Loading pages…
        </p>
      )}
      <ul className="grid gap-3">
        {rows?.map((p) => (
          <li key={p.slug} className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4">
            <button type="button" onClick={() => setEditing({ row: p, isNew: false })} className="min-w-0 flex-1 text-left">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{p.name || p.slug}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase", p.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-ink/10 text-ink-muted")}>{p.status === "published" ? "Live" : "Draft"}</span>
                {p.builtIn && <span className="rounded-full bg-gold/25 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-gold-dark">Built-in · not edited yet</span>}
              </span>
              <span className="mt-0.5 block truncate text-sm text-ink-soft">
                springs360.in/{p.slug} · {templates.find((t) => t.id === p.template)?.label}
                {p.updatedAt ? ` · saved ${p.updatedAt.toLocaleDateString()}` : ""}
              </span>
            </button>
            <div className="flex gap-1.5">
              <a href={`/${p.slug}${p.status === "published" ? "" : "?preview=1"}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink/15 p-2 text-ink-muted hover:border-ink" aria-label="Open page">
                <ExternalLink size={15} />
              </a>
              <button
                type="button"
                aria-label="Duplicate"
                onClick={() => {
                  const { updatedAt: _u, builtIn: _b, ...copy } = JSON.parse(JSON.stringify(p)) as Row;
                  setEditing({ row: { ...copy, slug: `${p.slug}-copy`, name: `${p.name} (copy)`, status: "draft" }, isNew: true });
                }}
                className="rounded-full border border-ink/15 p-2 text-ink-muted hover:border-ink"
              >
                <Copy size={15} />
              </button>
              {!p.builtIn && (
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={async () => {
                    if (!window.confirm(`Delete springs360.in/${p.slug}? This can't be undone.`)) return;
                    try {
                      await deletePage(p.slug);
                      refresh();
                    } catch {
                      setError("Could not delete the page.");
                    }
                  }}
                  className="rounded-full border border-[#9B2C2C]/30 p-2 text-[#9B2C2C] hover:bg-[#9B2C2C]/5"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-ink-soft">
        Tip: add <code className="rounded bg-sage-100 px-1">?src=instagram</code> (or any word) to links you share. The source is saved with every lead.
      </p>
    </div>
  );
}
