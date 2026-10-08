import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Timestamp } from "firebase/firestore/lite";
import { Seo } from "@/lib/seo";
import { getDb } from "@/lib/firebase";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { inputBase } from "@/components/forms/Field";
import { Markdown } from "@/lib/markdown";
import { cn, formatDate, readingTime, slugify } from "@/lib/utils";
import { EDITORIAL_AUTHOR, insightCategories, staticInsights } from "@/data/insights";
import { pillars, services } from "@/data/services";
import type { InsightDoc } from "@/lib/insights";
import { useAdmin, signOutAdmin } from "./useAdmin";

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

const leadStatuses = ["new", "contacted", "qualified", "won", "closed"] as const;

interface Lead {
  id: string;
  intent: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  industry?: string;
  channels?: string[];
  budget?: string;
  challenge?: string;
  outcome?: string;
  message?: string;
  page?: string;
  status: string;
  createdAt?: Timestamp;
}

function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const [db, fs] = await Promise.all([getDb(), import("firebase/firestore/lite")]);
      const snap = await fs.getDocs(fs.query(fs.collection(db, "leads"), fs.orderBy("createdAt", "desc"), fs.limit(300)));
      setLeads(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) })));
    } catch (e) {
      setError("Could not load leads. Check that your account is an admin and that the Firestore rules are deployed.");
      console.error(e);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    const [db, fs] = await Promise.all([getDb(), import("firebase/firestore/lite")]);
    await fs.updateDoc(fs.doc(db, "leads", id), { status });
    setLeads((ls) => ls?.map((l) => (l.id === id ? { ...l, status } : l)) ?? null);
  };

  const shown = (leads ?? []).filter((l) => filter === "all" || l.status === filter);

  return (
    <section aria-labelledby="leads-h">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="leads-h" className="font-display text-3xl text-ink">
          Leads
        </h2>
        <div className="flex flex-wrap gap-2">
          {["all", ...leadStatuses].map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filter === s}
              onClick={() => setFilter(s)}
              className={cn("min-h-[36px] rounded-sm border px-3 text-sm capitalize", filter === s ? "border-forest bg-forest text-ivory" : "border-ink/20 text-ink-muted")}
            >
              {s}
            </button>
          ))}
          <button type="button" onClick={() => load()} className="min-h-[36px] px-3 text-sm text-ink-muted underline">
            Refresh
          </button>
        </div>
      </div>

      {error && <p role="alert" className="mt-6 text-[#9B2C2C]">{error}</p>}
      {!leads && !error && <p className="mt-6 text-ink-muted">Loading…</p>}
      {leads && shown.length === 0 && <p className="mt-6 text-ink-muted">No leads in this view.</p>}

      <ul className="mt-6 divide-y divide-ink/10 rounded border border-ink/10 bg-ivory-50">
        {shown.map((l) => (
          <li key={l.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <button type="button" onClick={() => setOpen(open === l.id ? null : l.id)} aria-expanded={open === l.id} className="text-left">
                <p className="font-medium text-ink">
                  {l.name} {l.company && <span className="text-ink-muted">· {l.company}</span>}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {l.intent === "strategy-call" ? "Strategy call" : "General"} · {l.challenge ?? l.message?.slice(0, 80)}
                </p>
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-soft">{l.createdAt ? l.createdAt.toDate().toLocaleString() : ""}</span>
                <label className="sr-only" htmlFor={`st-${l.id}`}>
                  Status
                </label>
                <select id={`st-${l.id}`} value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} className="h-9 rounded-sm border border-ink/20 bg-ivory px-2 text-sm capitalize">
                  {leadStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {open === l.id && (
              <dl className="mt-4 grid gap-3 rounded bg-ivory p-4 text-sm sm:grid-cols-2">
                {(
                  [
                    ["Email", l.email && <a className="underline" href={`mailto:${l.email}?subject=${encodeURIComponent("Your Springs 360 enquiry")}`}>{l.email}</a>],
                    ["Phone", l.phone && <a className="underline" href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>],
                    ["Website", l.website],
                    ["Industry", l.industry],
                    ["Budget", l.budget],
                    ["Channels", l.channels?.join(", ")],
                    ["Desired outcome", l.outcome],
                    ["Message", l.message],
                    ["Submitted from", l.page],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className={k === "Desired outcome" || k === "Message" ? "sm:col-span-2" : undefined}>
                      <dt className="text-ink-soft">{k}</dt>
                      <dd className="mt-0.5 whitespace-pre-wrap text-ink">{v}</dd>
                    </div>
                  ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Insights CMS                                                        */
/* ------------------------------------------------------------------ */

type Draft = InsightDoc & { id?: string };

const today = () => new Date().toISOString().slice(0, 10);

const emptyDraft = (): Draft => ({
  slug: "",
  title: "",
  excerpt: "",
  category: "Growth",
  content: "",
  author: EDITORIAL_AUTHOR,
  coverImage: "",
  coverAlt: "",
  seoTitle: "",
  seoDescription: "",
  relatedService: "",
  publishedAt: today(),
  status: "draft",
  featured: false,
});

function InsightEditor({ initial, onSaved, onCancel }: { initial: Draft; onSaved: () => void; onCancel: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const staticClash = staticInsights.some((s) => s.slug === d.slug);

  const save = async (status?: Draft["status"]) => {
    setMsg("");
    const next = { ...d, status: status ?? d.status, slug: slugify(d.slug || d.title) };
    if (!next.title.trim() || !next.slug || !next.excerpt.trim() || !next.content.trim()) {
      setMsg("Title, slug, excerpt and content are required.");
      return;
    }
    setBusy(true);
    try {
      const [db, fs] = await Promise.all([getDb(), import("firebase/firestore/lite")]);
      const { id, ...data } = next;
      const payload: InsightDoc = { ...data, updatedAt: today() };
      await fs.setDoc(fs.doc(db, "insights", next.slug), payload);
      if (id && id !== next.slug) await fs.deleteDoc(fs.doc(db, "insights", id));
      setD({ ...next, id: next.slug });
      setMsg(payload.status === "published" ? "Published. It appears on the site immediately and is prerendered on the next deploy." : "Draft saved.");
      onSaved();
    } catch (e) {
      console.error(e);
      setMsg("Save failed — check your admin access and Firestore rules.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!d.id) return;
    setBusy(true);
    const [db, fs] = await Promise.all([getDb(), import("firebase/firestore/lite")]);
    await fs.deleteDoc(fs.doc(db, "insights", d.id));
    setBusy(false);
    onSaved();
    onCancel();
  };

  const field = "mb-2 block text-sm font-medium text-ink";
  return (
    <div className="rounded border border-ink/10 bg-ivory-50 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-2xl text-ink">{d.id ? "Edit insight" : "New insight"}</h3>
        <button type="button" onClick={onCancel} className="text-sm text-ink-muted underline">
          Back to list
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className={field} htmlFor="i-title">Title</label>
            <input
              id="i-title"
              className={cn(inputBase, "h-12")}
              value={d.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <label className={field} htmlFor="i-slug">Slug</label>
            <input
              id="i-slug"
              className={cn(inputBase, "h-12")}
              value={d.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
            <p className="mt-2 text-sm text-ink-soft">/insights/{d.slug || "…"}</p>
            {staticClash && <p className="mt-1 text-sm text-gold-dark">This slug matches a built-in article — publishing will replace it.</p>}
          </div>
          <div>
            <label className={field} htmlFor="i-excerpt">Excerpt</label>
            <textarea id="i-excerpt" rows={3} className={cn(inputBase, "py-3")} value={d.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-ink" htmlFor="i-content">
                Content <span className="font-normal text-ink-soft">(Markdown · ~{readingTime(d.content)} min read)</span>
              </label>
              <button type="button" onClick={() => setPreview((p) => !p)} className="text-sm text-ink-muted underline">
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
            {preview ? (
              <div className="prose-editorial max-h-[70vh] overflow-auto rounded-sm border border-ink/15 bg-ivory p-6">
                <Markdown source={d.content} />
              </div>
            ) : (
              <textarea
                id="i-content"
                rows={22}
                className={cn(inputBase, "py-3 font-mono text-sm")}
                value={d.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder={"## Section heading\n\nParagraph with **bold**, *italic* and [a link](/services).\n\n- List item\n\n> A pull quote"}
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className={field} htmlFor="i-cat">Category</label>
            <select id="i-cat" className={cn(inputBase, "h-12")} value={d.category} onChange={(e) => set("category", e.target.value)}>
              {insightCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={field} htmlFor="i-author">Author</label>
            <input id="i-author" className={cn(inputBase, "h-12")} value={d.author} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div>
            <label className={field} htmlFor="i-date">Publish date</label>
            <input id="i-date" type="date" className={cn(inputBase, "h-12")} value={d.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
            <p className="mt-2 text-sm text-ink-soft">Future dates stay hidden until that day.</p>
          </div>
          <div>
            <label className={field} htmlFor="i-svc">Related service</label>
            <select id="i-svc" className={cn(inputBase, "h-12")} value={d.relatedService} onChange={(e) => set("relatedService", e.target.value)}>
              <option value="">None</option>
              <optgroup label="Capabilities">
                {pillars.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </optgroup>
              <optgroup label="Services">
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className={field} htmlFor="i-cover">Cover image URL</label>
            <input id="i-cover" type="url" className={cn(inputBase, "h-12")} value={d.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://…" />
            <p className="mt-2 text-sm text-ink-soft">Leave empty to use generated artwork. 1600×900 recommended.</p>
          </div>
          <div>
            <label className={field} htmlFor="i-alt">Cover image alt text</label>
            <input id="i-alt" className={cn(inputBase, "h-12")} value={d.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} />
          </div>
          <div>
            <label className={field} htmlFor="i-seot">SEO title <span className="font-normal text-ink-soft">({(d.seoTitle || d.title).length}/60)</span></label>
            <input id="i-seot" className={cn(inputBase, "h-12")} value={d.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={d.title} />
          </div>
          <div>
            <label className={field} htmlFor="i-seod">SEO description <span className="font-normal text-ink-soft">({(d.seoDescription || d.excerpt).length}/160)</span></label>
            <textarea id="i-seod" rows={3} className={cn(inputBase, "py-3")} value={d.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder={d.excerpt} />
          </div>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" checked={!!d.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-forest" />
            Feature on Insights and home page
          </label>
          <p className="text-sm text-ink-muted">
            Status: <strong className="capitalize text-ink">{d.status}</strong>
          </p>
        </div>
      </div>

      {msg && <p role="status" className="mt-6 text-sm text-ink">{msg}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-6">
        <Button type="button" onClick={() => save("published")} disabled={busy}>
          {d.status === "published" ? "Update" : "Publish"}
        </Button>
        <Button type="button" variant="outline" arrow={false} onClick={() => save("draft")} disabled={busy}>
          {d.status === "published" ? "Unpublish (save as draft)" : "Save draft"}
        </Button>
        {d.status === "published" && d.id && (
          <Link to={`/insights/${d.id}`} target="_blank" className="text-sm text-ink-muted underline">
            View live
          </Link>
        )}
        {d.id && (
          <span className="ml-auto">
            {confirmDelete ? (
              <span className="flex items-center gap-3 text-sm">
                Delete permanently?
                <button type="button" onClick={remove} className="font-medium text-[#9B2C2C] underline">Yes, delete</button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="underline">Cancel</button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-[#9B2C2C] underline">
                Delete
              </button>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

function InsightsPanel() {
  const [items, setItems] = useState<Draft[] | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [db, fs] = await Promise.all([getDb(), import("firebase/firestore/lite")]);
      const snap = await fs.getDocs(fs.collection(db, "insights"));
      setItems(
        snap.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as InsightDoc) }))
          .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
      );
    } catch (e) {
      console.error(e);
      setError("Could not load insights. Check your admin access and Firestore rules.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const cmsSlugs = useMemo(() => new Set(items?.map((i) => i.slug)), [items]);

  if (editing) return <InsightEditor initial={editing} onSaved={load} onCancel={() => setEditing(null)} />;

  return (
    <section aria-labelledby="ins-h">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="ins-h" className="font-display text-3xl text-ink">
          Insights
        </h2>
        <Button type="button" onClick={() => setEditing(emptyDraft())}>
          New insight
        </Button>
      </div>
      {error && <p role="alert" className="mt-6 text-[#9B2C2C]">{error}</p>}

      <h3 className="eyebrow mt-10 text-ink-muted">Managed in the CMS</h3>
      {!items && !error && <p className="mt-4 text-ink-muted">Loading…</p>}
      {items && items.length === 0 && <p className="mt-4 text-ink-muted">No CMS articles yet. Create one to publish without a code change.</p>}
      <ul className="mt-4 divide-y divide-ink/10 rounded border border-ink/10 bg-ivory-50">
        {items?.map((i) => (
          <li key={i.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-ink">{i.title}</p>
              <p className="text-sm text-ink-muted">
                {i.category} · {formatDate(i.publishedAt)} ·{" "}
                <span className={i.status === "published" ? "text-forest-500" : "text-gold-dark"}>{i.status}</span>
              </p>
            </div>
            <button type="button" onClick={() => setEditing({ ...emptyDraft(), ...i })} className="text-sm underline">
              Edit
            </button>
          </li>
        ))}
      </ul>

      <h3 className="eyebrow mt-12 text-ink-muted">Built-in articles (in code)</h3>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        These ship with the site. Publishing a CMS article with the same slug overrides one.
      </p>
      <ul className="mt-4 divide-y divide-ink/10 rounded border border-ink/10">
        {staticInsights.map((s) => (
          <li key={s.slug} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="text-ink">{s.title}</p>
              <p className="text-sm text-ink-muted">
                {s.category} · {formatDate(s.publishedAt)} {cmsSlugs.has(s.slug) && "· overridden by CMS"}
              </p>
            </div>
            <Link to={`/insights/${s.slug}`} target="_blank" className="text-sm underline">
              View
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
  const admin = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"leads" | "insights">("leads");

  useEffect(() => {
    if (admin.status === "signed-out" || admin.status === "forbidden") navigate("/admin", { replace: true });
  }, [admin, navigate]);

  return (
    <div className="min-h-screen bg-ivory-200">
      <Seo title="Dashboard" description="Springs 360 administration." path="/dashboard" noindex />
      <header className="on-dark bg-deep text-ivory">
        <div className="container-site flex h-16 items-center justify-between gap-6">
          <Link to="/" aria-label="View site">
            <Logo />
          </Link>
          {admin.status === "admin" && (
            <div className="flex items-center gap-5 text-sm">
              <span className="hidden text-ivory/70 sm:inline">{admin.user.email}</span>
              <button type="button" onClick={() => signOutAdmin()} className="underline">
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>
      <main id="main" className="container-site py-10">
        {admin.status !== "admin" ? (
          <p className="text-ink-muted">Checking access…</p>
        ) : (
          <>
            <div role="tablist" aria-label="Dashboard sections" className="mb-10 flex gap-2 border-b border-ink/15">
              {(["leads", "insights"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={cn("-mb-px border-b-2 px-4 py-3 text-sm font-medium capitalize", tab === t ? "border-forest text-ink" : "border-transparent text-ink-muted")}
                >
                  {t}
                </button>
              ))}
            </div>
            <div role="tabpanel">{tab === "leads" ? <LeadsPanel /> : <InsightsPanel />}</div>
          </>
        )}
      </main>
    </div>
  );
}
