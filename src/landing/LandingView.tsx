import { useEffect, useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { HeroField } from "@/components/art/HeroField";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { useMedia } from "@/content/ContentProvider";
import { Seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { submitLandingLead } from "./api";
import { AuditFlow, ExampleCard } from "./Audit";
import { CourseGrid } from "./Courses";
import { Accent, FloatingWhatsApp, LpFooter, LpHeader, Section, lpBtn, lpInput } from "./ui";
import type { LandingPage } from "./types";

export const mediaPath = (ref?: string) => (ref?.startsWith("media:") ? `/media/${ref.slice(6)}` : ref || undefined);

function HeroVisual({ page }: { page: LandingPage }) {
  const img = useMedia(page.hero.image);
  if (page.hero.video)
    return (
      <div className="overflow-hidden rounded-[1.75rem] bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
        <VideoEmbed src={page.hero.video} title={page.seoTitle || page.name} />
      </div>
    );
  if (img) return <img src={img} alt="" className="w-full rounded-[1.75rem] object-cover shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]" />;
  return null;
}

function LeadForm({ page }: { page: LandingPage }) {
  const { form } = page;
  const [f, setF] = useState({ name: "", phone: "", email: "", company: "", message: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (f.name.trim().length < 2) return setErr("Please enter your name.");
    if (f.phone.replace(/\D/g, "").length < 10) return setErr("Enter a WhatsApp number with at least 10 digits.");
    if (form.askEmail && f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) return setErr("That email address doesn't look right.");
    setErr("");
    setBusy(true);
    try {
      await submitLandingLead({
        intent: "landing",
        name: f.name.trim().slice(0, 100),
        phone: f.phone.trim().slice(0, 30),
        email: f.email.trim().slice(0, 160) || undefined,
        company: f.company.trim().slice(0, 120) || undefined,
        message: f.message.trim().slice(0, 1500) || undefined,
        source: new URLSearchParams(window.location.search).get("src") ?? undefined,
        page: window.location.pathname,
      });
      setSent(true);
    } catch {
      setErr("We couldn't send that. Please try again, or message us on WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div className="flex flex-col items-center gap-4 rounded-[1.75rem] bg-ivory-50 p-8 text-center text-ink">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-200 text-forest">
          <Check size={28} />
        </span>
        <p className="text-lg">{form.doneText}</p>
      </div>
    );
  return (
    <form id="lead-form" onSubmit={submit} noValidate className="grid scroll-mt-6 gap-4 rounded-[1.75rem] bg-ivory-50 p-6 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-7">
      <div>
        <h2 className="text-2xl font-bold">{form.title}</h2>
        {form.text && <p className="mt-1 text-sm text-ink-muted">{form.text}</p>}
      </div>
      <label className="grid gap-1.5 text-sm font-semibold">
        Your name
        <input id="lf-name" className={lpInput} autoComplete="name" value={f.name} onChange={set("name")} />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold">
        WhatsApp number
        <input id="lf-phone" className={lpInput} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98xxx xxxxx" value={f.phone} onChange={set("phone")} />
      </label>
      {form.askEmail && (
        <label className="grid gap-1.5 text-sm font-semibold">
          Email <span className="font-normal text-ink-soft">(optional)</span>
          <input id="lf-email" className={lpInput} type="email" autoComplete="email" value={f.email} onChange={set("email")} />
        </label>
      )}
      {form.askCompany && (
        <label className="grid gap-1.5 text-sm font-semibold">
          Business name
          <input id="lf-company" className={lpInput} autoComplete="organization" value={f.company} onChange={set("company")} />
        </label>
      )}
      {form.messageLabel && (
        <label className="grid gap-1.5 text-sm font-semibold">
          {form.messageLabel}
          <textarea id="lf-message" className={cn(lpInput, "min-h-[96px]")} value={f.message} onChange={set("message")} />
        </label>
      )}
      {err && (
        <p role="alert" className="text-sm text-[#9B2C2C]">
          {err}
        </p>
      )}
      <button type="submit" disabled={busy} className={lpBtn}>
        {busy && <Loader2 size={18} className="animate-spin" />} {form.buttonLabel || "Send"}
      </button>
    </form>
  );
}

export function LandingView({ page, preview }: { page: LandingPage; preview?: boolean }) {
  const [quiz, setQuiz] = useState(false);
  const { hero } = page;

  // springs360.in/audit?start=1 opens the quiz straight away (used by the home page).
  useEffect(() => {
    if (page.template === "audit" && new URLSearchParams(window.location.search).has("start")) setQuiz(true);
  }, [page.template]);

  const cta = () => {
    if (page.template === "audit") return setQuiz(true);
    const el = document.getElementById(page.template === "courses" ? "courses" : "lead-form");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    el?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
  };
  const ctaButton = (label: string) => (
    <button type="button" onClick={cta} className={lpBtn}>
      {label} <span aria-hidden="true">→</span>
    </button>
  );

  const right = page.template === "audit" && page.quiz.pillars.length ? <ExampleCard page={page} /> : page.template === "leadform" ? <LeadForm page={page} /> : <HeroVisual page={page} />;
  const hasRight = !!right && (page.template !== "courses" || !!(hero.image || hero.video));

  return (
    <>
      <Seo title={page.seoTitle || page.name} description={page.seoDescription || hero.text} path={`/${page.slug}`} image={mediaPath(page.ogImage)} noindex={preview || page.status !== "published"} />
      {preview && page.status !== "published" && <div className="fixed inset-x-0 top-0 z-[60] bg-gold py-1.5 text-center text-xs font-bold text-deep">Draft preview · only admins can see this page</div>}
      <LpHeader tag={page.tag} />
      <main id="main">
        <section className="on-dark relative isolate overflow-hidden bg-deep text-ivory">
          <HeroField className="absolute inset-0 -z-10 h-full w-full opacity-25" />
          <div className={cn("container-site grid items-center gap-12 pb-16 pt-28 sm:pb-24 sm:pt-36", hasRight && "lg:grid-cols-[1.1fr_0.9fr] lg:gap-16")}>
            <div className="flex min-w-0 flex-col gap-6">
              {hero.eyebrow && <p className="eyebrow text-gold-light">{hero.eyebrow}</p>}
              <h1 className="text-balance font-display text-display-xl font-extrabold">
                <Accent text={hero.headline} emClass="text-gold-light" />
              </h1>
              {hero.text && <p className="max-w-xl text-lead text-ivory/75">{hero.text}</p>}
              {page.template !== "leadform" && (
                <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center xs:gap-5">
                  {ctaButton(hero.ctaLabel)}
                  {hero.ctaNote && <span className="text-sm text-ivory/60">{hero.ctaNote}</span>}
                </div>
              )}
              {hero.chips.length > 0 && (
                <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/70">
                  {hero.chips.filter(Boolean).map((c) => (
                    <li key={c} className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {hasRight && <div className="min-w-0">{right}</div>}
          </div>
        </section>

        <div className="bg-ivory-100">
          {page.template === "courses" && <CourseGrid page={page} />}
          {page.sections.map((s, i) => (
            <Section key={i} s={s} pillars={page.template === "audit" ? page.quiz.pillars : undefined} />
          ))}
        </div>

        {(page.final.title || page.final.ctaLabel) && (
          <section className="on-dark bg-deep text-ivory">
            <div className="container-site flex flex-col items-center gap-6 py-20 text-center sm:py-28">
              <h2 className="max-w-3xl text-balance font-display text-display-lg font-bold">
                <Accent text={page.final.title} emClass="text-gold-light" />
              </h2>
              {page.final.text && <p className="max-w-xl text-lead text-ivory/70">{page.final.text}</p>}
              {page.final.ctaLabel && ctaButton(page.final.ctaLabel)}
            </div>
          </section>
        )}
      </main>
      <LpFooter />
      {page.whatsapp && <FloatingWhatsApp text={`Hi Springs 360, I'm on your ${page.name || page.slug} page.`} />}
      {quiz && <AuditFlow page={page} onClose={() => setQuiz(false)} />}
    </>
  );
}
