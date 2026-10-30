import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  CircleDot,
  ExternalLink,
  FileText,
  FolderKanban,
  HelpCircle,
  Inbox,
  LayoutGrid,
  Layers,
  ListChecks,
  Loader2,
  LogOut,
  Menu,
  Settings as SettingsIcon,
  Factory,
  GraduationCap,
  MapPin,
  PanelsTopLeft,
  Receipt,
  Wallet,
  X,
} from "lucide-react";
import { Seo } from "@/lib/seo";
import { Logo } from "@/components/layout/Logo";
import type { Content } from "@/content/types";
import { slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAdmin, signInWithEmail, signInWithGoogle, signOutAdmin } from "./useAdmin";
import { loadContent, saveSection, type SectionId } from "./api";
import { FieldsForm, inputCls } from "./fields";
import { CollectionEditor } from "./CollectionEditor";
import { Leads } from "./Leads";
import { InsightsPanel } from "./InsightsPanel";
import { LandingPanel } from "./LandingPanel";
import { CoursesPanel } from "./CoursesPanel";
import { OrdersPanel, PaymentsPanel } from "./ShopPanels";
import { listOrders } from "./landingApi";
import * as S from "./schemas";

/* ------------------------------------------------------------------ */
/* Sign in                                                             */
/* ------------------------------------------------------------------ */

function SignIn({ forbiddenEmail }: { forbiddenEmail?: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function google() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      setError(
        code.includes("unauthorized-domain")
          ? "This domain isn't authorised yet: Firebase console → Authentication → Settings → Authorized domains → add springs360.in and www.springs360.in."
          : code.includes("operation-not-allowed")
            ? "Google sign-in isn't enabled: Firebase console → Authentication → Sign-in method → Google → Enable."
            : code.includes("popup-closed")
              ? ""
              : "Sign-in failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmail(email.trim(), password);
    } catch {
      setError("Those credentials were not recognised.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-deep px-5 py-16 text-ivory">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-block">
          <Logo />
        </Link>
        <div className="mt-8 rounded-[2rem] bg-ivory-50 p-8 text-ink shadow-soft">
          <h1 className="font-display text-3xl font-extrabold">Admin</h1>
          {forbiddenEmail ? (
            <div className="mt-5 space-y-4 text-sm text-ink-muted">
              <p>
                Signed in as <strong className="text-ink">{forbiddenEmail}</strong>, but this account isn't an admin.
              </p>
              <p>
                Add this email to <code className="rounded bg-sage-100 px-1">isAdmin()</code> in <code className="rounded bg-sage-100 px-1">firestore.rules</code> and run{" "}
                <code className="rounded bg-sage-100 px-1">firebase deploy --only firestore:rules</code> — or create the document <code className="rounded bg-sage-100 px-1">admins/&lt;your UID&gt;</code> in Firestore.
              </p>
              <button type="button" className="font-semibold text-forest underline" onClick={() => signOutAdmin()}>
                Sign out
              </button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-ink-muted">Manage the Springs 360 website and leads.</p>
              <button type="button" onClick={google} disabled={busy} className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-ink/15 bg-white py-3 font-semibold hover:border-ink disabled:opacity-60">
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
                </svg>
                Continue with Google
              </button>
              <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
                <span className="h-px flex-1 bg-ink/10" /> or email <span className="h-px flex-1 bg-ink/10" />
              </div>
              <form onSubmit={submit} className="space-y-3" noValidate>
                <input className={inputCls} type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className={inputCls} type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" disabled={busy} className="w-full rounded-full bg-forest py-3 font-semibold text-ivory hover:bg-deep disabled:opacity-60">
                  Sign in
                </button>
              </form>
            </>
          )}
          {error && (
            <p role="alert" className="mt-4 text-sm text-[#9B2C2C]">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

type Tab = "leads" | "insights" | "landing" | "courses" | "orders" | "payments" | SectionId;

const tabs: { id: Tab; label: string; icon: typeof Inbox; hint: string }[] = [
  { id: "leads", label: "Leads", icon: Inbox, hint: "Strategy-call and contact-form enquiries." },
  { id: "landing", label: "Landing pages", icon: PanelsTopLeft, hint: "High-conversion pages at springs360.in/<url>: free audit, training, offers. Create as many as you like." },
  { id: "orders", label: "Course orders", icon: Receipt, hint: "Verify payments and send access passwords." },
  { id: "courses", label: "Courses", icon: GraduationCap, hint: "Online courses: price, free preview video and the full lessons." },
  { id: "payments", label: "Payment methods", icon: Wallet, hint: "UPI, Google Pay, card, Apple Pay, PayPal: what buyers see in the payment pop-up." },
  { id: "insights", label: "Insights (blog)", icon: FileText, hint: "Write, publish and edit articles." },
  { id: "settings", label: "Hero, contact & links", icon: SettingsIcon, hint: "Home hero text and image, main button, phone, WhatsApp, email, hours and social links." },
  { id: "catalog", label: "Services menu", icon: LayoutGrid, hint: "The service cards customers see (name, outcome, icon, home page)." },
  { id: "growth", label: "Growth wheel", icon: CircleDot, hint: "The steps of the 360° growth wheel (home, services, about)." },
  { id: "pillars", label: "Capabilities", icon: Layers, hint: "Capability pages (/services/strategy, …): approach, services, FAQ." },
  { id: "services", label: "Service pages", icon: ListChecks, hint: "Detailed service pages: intro, approach, deliverables, measures." },
  { id: "work", label: "Work / case studies", icon: FolderKanban, hint: "Case studies (use cases). Drafts stay hidden until published." },
  { id: "industries", label: "Industries", icon: Factory, hint: "Industry pages and the home page industries list." },
  { id: "locations", label: "Locations (local SEO)", icon: MapPin, hint: "City pages for local Google searches (springs360.in/locations/hyderabad …) with local structured data." },
  { id: "faqs", label: "FAQ", icon: HelpCircle, hint: "Questions on the home and services pages." },
];

function sectionOf(c: Content, id: SectionId) {
  return id === "catalog" ? [c.catalog, c.stages] : c[id];
}

/** Returns an error message if the section can't be saved. */
function validate(c: Content, id: SectionId): string | null {
  const uniq = (vals: string[], what: string) => {
    for (const v of vals) {
      if (!v) return `Every ${what} needs a URL slug.`;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) return `“${v}” isn't a valid ${what} slug — use lowercase letters, numbers and dashes.`;
    }
    const dup = vals.find((v, i) => vals.indexOf(v) !== i);
    return dup ? `Two items use the same slug “${dup}”.` : null;
  };
  if (id === "work") return uniq(c.work.map((p) => p.slug), "case study");
  if (id === "industries") return uniq(c.industries.map((p) => p.slug), "industry");
  if (id === "locations") return uniq(c.locations.map((p) => p.slug), "location");
  if (id === "pillars" || id === "services") {
    const e = id === "pillars" ? uniq(c.pillars.map((p) => p.slug), "capability") : uniq(c.services.map((p) => p.slug), "service");
    if (e) return e;
    const all = [...c.pillars.map((p) => p.slug as string), ...c.services.map((s) => s.slug)];
    const clash = all.find((v, i) => all.indexOf(v) !== i);
    return clash ? `“${clash}” is used by both a capability and a service — slugs must be different.` : null;
  }
  if (id === "catalog" && c.catalog.some((x) => !x.slug)) return "Every service card must link to a service page.";
  return null;
}

/** Fills empty slugs from the name. */
function autoSlugs(c: Content, id: SectionId): Content {
  if (id === "work") return { ...c, work: c.work.map((p) => (p.slug ? p : { ...p, slug: slugify(`${p.client} ${p.title}`) })) };
  if (id === "industries") return { ...c, industries: c.industries.map((p) => (p.slug ? p : { ...p, slug: slugify(p.name) })) };
  if (id === "locations") return { ...c, locations: c.locations.map((p) => (p.slug ? p : { ...p, slug: slugify(p.city) })) };
  if (id === "services") return { ...c, services: c.services.map((p) => (p.slug ? p : { ...p, slug: slugify(p.name) })) };
  if (id === "pillars") return { ...c, pillars: c.pillars.map((p) => (p.slug ? p : { ...p, slug: slugify(p.name) as typeof p.slug })) };
  return c;
}

const panels: Tab[] = ["leads", "insights", "landing", "courses", "orders", "payments"];
const isSection = (t: Tab): t is SectionId => !panels.includes(t);

function Dashboard({ email }: { email: string | null }) {
  const [tab, setTab] = useState<Tab>("leads");
  const [saved, setSaved] = useState<Content | null>(null);
  const [draft, setDraft] = useState<Content | null>(null);
  const [savedAt, setSavedAt] = useState<Partial<Record<SectionId, string>>>({});
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [newCount, setNewCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    listOrders()
      .then((o) => setPendingOrders(o.filter((x) => x.status === "pending").length))
      .catch(() => {});
  }, []);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    loadContent()
      .then(({ content, saved }) => {
        setSaved(content);
        setDraft(content);
        setSavedAt(saved);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Could not load content"));
  }, []);

  const dirty = useMemo(() => {
    const d: Partial<Record<SectionId, boolean>> = {};
    if (saved && draft) for (const t of tabs) if (isSection(t.id)) d[t.id] = JSON.stringify(sectionOf(saved, t.id)) !== JSON.stringify(sectionOf(draft, t.id));
    return d;
  }, [saved, draft]);
  const anyDirty = Object.values(dirty).some(Boolean);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (anyDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [anyDirty]);

  async function save(id: SectionId) {
    if (!draft) return;
    const next = autoSlugs(draft, id);
    const problem = validate(next, id);
    if (problem) return setMsg({ ok: false, text: problem });
    setSaving(true);
    setMsg(null);
    try {
      await saveSection(id, next);
      setDraft(next);
      setSaved((s) => (s ? applySection(s, next, id) : next));
      setSavedAt((x) => ({ ...x, [id]: new Date().toISOString() }));
      setMsg({ ok: true, text: "Saved — it's live on the site now." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? `Could not save: ${e.message}` : "Could not save." });
    } finally {
      setSaving(false);
    }
  }
  function discard(id: SectionId) {
    if (saved && draft) setDraft(applySection(draft, saved, id));
    setMsg(null);
  }

  const set = <K extends keyof Content>(k: K, v: Content[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const current = tabs.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen bg-ivory-200/60">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink/10 bg-deep px-4 text-ivory">
        <button type="button" className="lg:hidden" aria-label="Menu" onClick={() => setMenu((m) => !m)}>
          {menu ? <X /> : <Menu />}
        </button>
        <Link to="/" target="_blank">
          <Logo />
        </Link>
        <span className="ml-2 hidden rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-deep sm:inline">Admin</span>
        <a href="/" target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ivory/20 px-3 py-1.5 text-sm font-semibold hover:border-ivory">
          <ExternalLink size={14} /> View site
        </a>
        <span className="hidden text-sm text-ivory/60 md:inline">{email}</span>
        <button type="button" onClick={() => signOutAdmin()} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-ivory/10" aria-label="Sign out">
          <LogOut size={15} /> <span className="hidden sm:inline">Sign out</span>
        </button>
      </header>

      <div className="flex">
        <nav aria-label="Admin sections" className={cn("fixed inset-y-16 left-0 z-20 w-64 shrink-0 overflow-y-auto border-r border-ink/10 bg-white p-3 transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0", menu ? "translate-x-0" : "-translate-x-full")}>
          <ul className="space-y-1">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => {
                    setTab(t.id);
                    setMenu(false);
                    setMsg(null);
                  }}
                  className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold", tab === t.id ? "bg-forest text-ivory" : "text-ink hover:bg-ink/5")}
                >
                  <t.icon size={17} />
                  <span className="flex-1">{t.label}</span>
                  {t.id === "leads" && newCount > 0 && <span className="rounded-full bg-gold px-2 text-xs font-bold text-deep">{newCount}</span>}
                  {t.id === "orders" && pendingOrders > 0 && <span className="rounded-full bg-gold px-2 text-xs font-bold text-deep">{pendingOrders}</span>}
                  {isSection(t.id) && dirty[t.id] && <span className="h-2 w-2 rounded-full bg-gold" title="Unsaved changes" />}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 px-3 text-xs leading-relaxed text-ink-soft">
            Saved changes appear on the site immediately. Search engines see them after the nightly rebuild.
          </p>
        </nav>

        <main className="min-w-0 flex-1 p-4 pb-32 sm:p-8 sm:pb-32">
          <div className="mx-auto max-w-6xl">
            <h1 className="font-display text-3xl font-extrabold text-ink">{current.label}</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {current.hint}
              {isSection(tab) && savedAt[tab] && savedAt[tab] !== "saved" && <span className="ml-2 text-ink-soft">· Last saved {new Date(savedAt[tab]!).toLocaleString()}</span>}
              {isSection(tab) && !savedAt[tab] && <span className="ml-2 text-ink-soft">· Showing the built-in content (not saved yet)</span>}
            </p>
            <div className="mt-6">
              {tab === "leads" ? (
                <Leads onCount={setNewCount} />
              ) : tab === "insights" ? (
                <InsightsPanel />
              ) : tab === "landing" ? (
                <LandingPanel />
              ) : tab === "courses" ? (
                <CoursesPanel />
              ) : tab === "orders" ? (
                <OrdersPanel onCount={setPendingOrders} />
              ) : tab === "payments" ? (
                <PaymentsPanel />
              ) : loadError ? (
                <p className="rounded-xl bg-red-50 p-4 text-red-800">{loadError}</p>
              ) : !draft ? (
                <p className="flex items-center gap-2 text-ink-soft">
                  <Loader2 className="animate-spin" size={18} /> Loading content…
                </p>
              ) : (
                <SectionView tab={tab} draft={draft} set={set} />
              )}
            </div>
          </div>
        </main>
      </div>

      {isSection(tab) && draft && (dirty[tab] || msg) && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur lg:pl-[17rem]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
            {msg ? <p className={cn("text-sm font-semibold", msg.ok ? "text-emerald-700" : "text-[#9B2C2C]")}>{msg.text}</p> : <p className="text-sm font-semibold text-ink">You have unsaved changes.</p>}
            {dirty[tab] && (
              <div className="ml-auto flex gap-2">
                <button type="button" onClick={() => discard(tab)} className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:border-ink">
                  Discard
                </button>
                <button type="button" onClick={() => save(tab)} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-sm font-semibold text-ivory hover:bg-deep disabled:opacity-60">
                  {saving && <Loader2 size={15} className="animate-spin" />} Save changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function applySection(target: Content, source: Content, id: SectionId): Content {
  if (id === "catalog") return { ...target, catalog: source.catalog, stages: source.stages };
  return { ...target, [id]: source[id] };
}

function SectionView({ tab, draft, set }: { tab: SectionId; draft: Content; set: <K extends keyof Content>(k: K, v: Content[K]) => void }) {
  const card = "rounded-2xl border border-ink/10 bg-white p-5 sm:p-6";
  switch (tab) {
    case "settings":
      return (
        <div className={card}>
          <FieldsForm fields={S.settingsFields} value={draft.settings} onChange={(v) => set("settings", v as Content["settings"])} content={draft} />
        </div>
      );
    case "catalog":
      return (
        <div className="space-y-10">
          <CollectionEditor noun="service card" items={draft.catalog} onChange={(v) => set("catalog", v)} fields={S.catalogFields} newItem={S.newCatalogItem} title={(x) => x.label} subtitle={(x) => `${x.top ? "Home · " : ""}${x.stage} · /services/${x.slug}`} content={draft} />
          <div>
            <h2 className="mb-3 text-lg font-bold text-ink">Group titles (Services menu)</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {draft.stages.map((st, i) => (
                <div key={st.key} className={card}>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-soft">{st.key}</p>
                  <FieldsForm fields={S.stageFields} value={st} onChange={(v) => set("stages", draft.stages.map((x, j) => (j === i ? (v as typeof st) : x)))} content={draft} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "growth":
      return <CollectionEditor noun="step" items={draft.growth} onChange={(v) => set("growth", v)} fields={S.growthFields} newItem={S.newGrowth} title={(x) => `${x.index} · ${x.name}`} subtitle={(x) => x.verb} content={draft} />;
    case "pillars":
      return <CollectionEditor noun="capability" items={draft.pillars} onChange={(v) => set("pillars", v)} fields={S.pillarFields} newItem={S.newPillar} title={(x) => `${x.index} · ${x.name}`} subtitle={(x) => `/services/${x.slug || "…"}`} thumb={(x) => x.image} viewHref={(x) => (x.slug ? `/services/${x.slug}` : null)} content={draft} />;
    case "services":
      return <CollectionEditor noun="service page" items={draft.services} onChange={(v) => set("services", v)} fields={S.serviceFields} newItem={S.newService} title={(x) => x.name} subtitle={(x) => `${x.pillar} · /services/${x.slug || "…"}`} thumb={(x) => x.image} viewHref={(x) => (x.slug ? `/services/${x.slug}` : null)} content={draft} />;
    case "work":
      return <CollectionEditor noun="case study" items={draft.work} onChange={(v) => set("work", v)} fields={S.workFields} newItem={S.newWork} title={(x) => x.client} subtitle={(x) => `${x.verified ? "Real" : "Illustrative"} · ${x.title}`} thumb={(x) => x.image} viewHref={(x) => (x.slug && x.published !== false ? `/work/${x.slug}` : null)} content={draft} />;
    case "industries":
      return <CollectionEditor noun="industry" items={draft.industries} onChange={(v) => set("industries", v)} fields={S.industryFields} newItem={S.newIndustry} title={(x) => x.name} subtitle={(x) => x.summary} thumb={(x) => x.image} viewHref={(x) => (x.slug ? `/industries/${x.slug}` : null)} content={draft} />;
    case "locations":
      return <CollectionEditor noun="city" items={draft.locations} onChange={(v) => set("locations", v)} fields={S.locationFields} newItem={S.newLocation} title={(x) => x.city} subtitle={(x) => `${x.published === false ? "Hidden · " : ""}/locations/${x.slug || "…"}`} viewHref={(x) => (x.slug && x.published !== false ? `/locations/${x.slug}` : null)} content={draft} />;
    case "faqs":
      return <CollectionEditor noun="question" items={draft.faqs} onChange={(v) => set("faqs", v)} fields={S.faqFields} newItem={S.newFaq} title={(f) => f.question} content={draft} />;
  }
}

export default function Admin() {
  const admin = useAdmin();
  return (
    <>
      <Seo title="Admin" description="Springs 360 administration." path="/admin" noindex />
      {admin.status === "loading" ? (
        <main className="flex min-h-screen items-center justify-center bg-deep">
          <Loader2 className="animate-spin text-gold" size={32} />
        </main>
      ) : admin.status === "admin" ? (
        <Dashboard email={admin.user.email} />
      ) : (
        <SignIn forbiddenEmail={admin.status === "forbidden" ? admin.user.email : null} />
      )}
    </>
  );
}
