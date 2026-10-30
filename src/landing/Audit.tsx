import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { submitLandingLead } from "./api";
import { lpBtn, lpBtnDark, lpInput } from "./ui";
import type { LandingPage, QuizPillar } from "./types";

const OPTIONS = [
  { v: 10, label: "Yes", sub: "Fully in place" },
  { v: 5, label: "Partly", sub: "Started, not consistent" },
  { v: 0, label: "No", sub: "Not yet" },
];

const tone = (pct: number) => (pct >= 0.7 ? "#2E9A6A" : pct >= 0.4 ? "#C9932B" : "#C8553D");

/** 360° ring split into one segment per pillar; each segment fills to its score. */
export function Dial({ values, size = 240, label, total }: { values: number[]; size?: number; label: string; total: number }) {
  const [on, setOn] = useState(false);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / 1100);
      setShown(Math.round(total * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(raf);
    };
  }, [total]);
  const n = Math.max(1, values.length);
  const r = 80;
  const c = 2 * Math.PI * r;
  const gap = n > 1 ? 5 : 0;
  const len = c / n - gap;
  return (
    <div className="relative mx-auto aspect-square max-w-full" style={{ width: size }}>
      <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={`${label}: ${total} out of 100`}>
        {values.map((v, i) => {
          const rot = -90 + (i * 360) / n + (gap / c) * 180;
          return (
            <g key={i} transform={`rotate(${rot} 100 100)`}>
              <circle cx="100" cy="100" r={r} fill="none" stroke="#E4EBE6" strokeWidth="16" strokeDasharray={`${len} ${c}`} />
              <circle cx="100" cy="100" r={r} fill="none" stroke={tone(v)} strokeWidth="16" strokeDasharray={`${on ? len * v : 0} ${c}`} style={{ transition: `stroke-dasharray 1.1s cubic-bezier(.2,.8,.2,1) ${i * 0.12}s` }} />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <div className="text-5xl font-extrabold tabular-nums leading-none text-ink">
          {shown}
          <span className="text-lg font-semibold text-ink-soft">/100</span>
        </div>
        <div className="eyebrow mt-2 text-[0.65rem] text-ink-soft">{label}</div>
      </div>
    </div>
  );
}

export function Bars({ pillars, values, max }: { pillars: QuizPillar[]; values: number[]; max?: number[] }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="grid gap-2.5">
      {pillars.map((p, i) => (
        <div key={p.key} className="grid grid-cols-[6.5rem_1fr_2.8rem] items-center gap-3 text-sm">
          <span className="truncate text-ink">{p.short || p.name}</span>
          <span className="h-2 overflow-hidden rounded-full bg-[#E4EBE6]">
            <span className="block h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: on ? `${values[i] * 100}%` : 0, background: tone(values[i]) }} />
          </span>
          <span className="text-right text-xs tabular-nums text-ink-soft">{max ? `${Math.round(values[i] * max[i])}/${max[i]}` : `${Math.round(values[i] * 100)}%`}</span>
        </div>
      ))}
    </div>
  );
}

export function ExampleCard({ page }: { page: LandingPage }) {
  const { pillars } = page.quiz;
  const values = pillars.map((p) => Math.max(0, Math.min(100, Number(p.example) || 0)) / 100);
  const total = Math.round((values.reduce((a, b) => a + b, 0) / Math.max(1, values.length)) * 100);
  const initials = page.quiz.exampleName.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="min-w-0 rounded-[1.75rem] bg-ivory-50 p-5 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-6" aria-label="Example audit result">
      <div className="flex items-center gap-3 border-b border-ink/10 pb-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-200 font-bold text-forest">{initials || "S"}</span>
        <span className="min-w-0">
          <b className="block truncate">{page.quiz.exampleName}</b>
          <span className="block truncate text-sm text-ink-soft">{page.quiz.exampleSubtitle}</span>
        </span>
      </div>
      <div className="my-5">
        <Dial values={values} total={total} size={220} label="Growth score" />
      </div>
      <Bars pillars={pillars} values={values} />
      {page.quiz.exampleNote && <p className="mt-4 rounded-xl bg-sage-100 p-3.5 text-sm text-ink">{page.quiz.exampleNote}</p>}
      <p className="mt-3 text-center text-xs text-ink-soft">Example audit · fictional business</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quiz flow                                                           */
/* ------------------------------------------------------------------ */

export function AuditFlow({ page, onClose }: { page: LandingPage; onClose: () => void }) {
  const { pillars, questions } = page.quiz;
  const [answers, setAnswers] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<{ name: string } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  useEffect(() => {
    box.current?.scrollTo(0, 0);
    box.current?.querySelector<HTMLButtonElement>("[data-opt]")?.focus({ preventScroll: true });
  }, [idx, done]);

  const finished = idx >= questions.length;
  const result = useMemo(() => {
    const max = pillars.map((p) => questions.filter((q) => q.pillar === p.key).length * 10);
    const got = pillars.map((p) => questions.reduce((s, q, i) => (q.pillar === p.key ? s + (answers[i] ?? 0) : s), 0));
    const values = got.map((g, i) => (max[i] ? g / max[i] : 0));
    const total = Math.round((got.reduce((a, b) => a + b, 0) / Math.max(1, questions.length * 10)) * 100);
    const order = pillars.map((p, i) => ({ p, v: values[i], i })).filter((x) => max[x.i] > 0).sort((a, b) => a.v - b.v);
    return { max, got, values, total, order };
  }, [answers, pillars, questions]);

  function answer(v: number) {
    setAnswers((a) => {
      const n = a.slice();
      n[idx] = v;
      return n;
    });
    window.setTimeout(() => setIdx((i) => i + 1), 160);
  }

  const q = questions[idx];
  const qp = pillars.find((p) => p.key === q?.pillar);
  const progress = finished ? 100 : (idx / Math.max(1, questions.length)) * 100;

  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label="Growth audit" className="fixed inset-0 z-50 overflow-y-auto bg-ivory-100" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-7 px-gutter py-5">
        <div className="flex items-center justify-between text-ink">
          <Logo />
          <button type="button" onClick={onClose} className="rounded-full px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-ink/5">
            Close
          </button>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#E4EBE6]" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-forest-500 transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-5 pt-10 text-center">
            <Dial values={result.values} total={result.total} size={180} label="Your score" />
            <h2 className="font-display text-display-sm font-bold text-ink">Thanks, {done.name.split(" ")[0]}.</h2>
            <p className="max-w-md text-ink-muted">
              Your score is <b className="text-ink">{result.total}/100</b>
              {result.order[0] && (
                <>
                  {" "}and your weakest pillar is <b className="text-ink">{result.order[0].p.name}</b>
                </>
              )}
              . {page.quiz.doneText}
            </p>
            <button type="button" className={lpBtnDark} onClick={onClose}>
              Back to the page
            </button>
          </div>
        ) : !finished && q ? (
          <>
            <div>
              <p className="eyebrow text-forest-500">
                {idx + 1} / {questions.length}
                {qp ? ` · ${qp.name}` : ""}
              </p>
              <h2 className="mt-4 text-balance font-display text-display-sm font-bold text-ink">{q.question}</h2>
              {q.why && <p className="mt-3 text-ink-muted">{q.why}</p>}
            </div>
            <div className="grid gap-3">
              {OPTIONS.map((o) => (
                <button
                  key={o.v}
                  data-opt
                  type="button"
                  onClick={() => answer(o.v)}
                  className={cn("flex items-center justify-between gap-4 rounded-2xl border-[1.5px] bg-white px-5 py-4 text-left text-lg font-semibold text-ink transition-colors hover:border-forest-500", answers[idx] === o.v ? "border-forest-500 bg-sage-100" : "border-ink/10")}
                >
                  {o.label}
                  <span className="text-sm font-normal text-ink-soft">{o.sub}</span>
                </button>
              ))}
            </div>
            {idx > 0 && (
              <button type="button" onClick={() => setIdx((i) => i - 1)} className="self-start rounded-full px-1 py-2 text-sm font-semibold text-ink-muted hover:text-ink">
                ← Back
              </button>
            )}
          </>
        ) : (
          <Result page={page} result={result} answers={answers} onDone={setDone} />
        )}
      </div>
    </div>
  );
}

type ResultData = { max: number[]; got: number[]; values: number[]; total: number; order: { p: QuizPillar; v: number; i: number }[] };

function Chips({ options, value, onChange, multi, label, hint }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean; label: string; hint?: string }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-semibold text-ink">
        {label}
        {hint && <span className="ml-1.5 font-normal text-ink-soft">{hint}</span>}
      </legend>
      <div className="mt-1 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(multi ? (on ? value.filter((x) => x !== o) : [...value, o]) : on ? [] : [o])}
              className={cn("inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[1.5px] px-4 text-[0.95rem] font-medium", on ? "border-forest bg-forest text-ivory" : "border-ink/15 bg-white text-ink hover:border-forest-500")}
            >
              {on && <Check size={15} aria-hidden="true" />}
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

type FormState = {
  company: string;
  industry: string;
  website: string;
  noWebsite: boolean;
  locations: string;
  revenue: string[];
  targetRevenue: string[];
  channels: string[];
  preferredChannels: string[];
  budget: string[];
  name: string;
  phone: string;
  email: string;
};

const STEPS = ["Your business", "Your goals", "Your plan"];

function Result({ page, result, answers, onDone }: { page: LandingPage; result: ResultData; answers: number[]; onDone: (d: { name: string }) => void }) {
  const { pillars, revenueRanges, contactChannels, budgetRanges, businessTypes } = page.quiz;
  const [f, setF] = useState<FormState>({ company: "", industry: "", website: "", noWebsite: false, locations: "", revenue: [], targetRevenue: [], channels: [], preferredChannels: [], budget: [], name: "", phone: "", email: "" });
  const [step, setStep] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const verdict =
    result.total >= 75
      ? "Strong foundation. You're ready to scale with more ad spend."
      : result.total >= 45
        ? "You're leaving enquiries on the table. One or two fixes will move the needle fast."
        : "Customers are slipping past you at several points. The first fixes are quick.";
  const fixes = result.order.filter((x) => x.v < 1).slice(0, 3);
  const hasGoals = revenueRanges.length > 0 || contactChannels.length > 0 || budgetRanges.length > 0;
  const steps = hasGoals ? STEPS : [STEPS[0], STEPS[2]];
  const current = steps[step];

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((x) => ({ ...x, [k]: v }));
  const text = (k: "company" | "website" | "locations" | "name" | "phone" | "email") => (e: { target: { value: string } }) => set(k, e.target.value);

  function go(next: number) {
    setErr("");
    setStep(next);
    window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function validStep() {
    if (current === "Your business") {
      if (!f.company.trim()) return "Please enter your business name.";
      const w = f.website.trim();
      if (w && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(w)) return "That website address doesn't look right, e.g. mybusiness.in";
    }
    if (current === "Your plan") {
      if (f.name.trim().length < 2) return "Please enter your name.";
      if (f.phone.replace(/\D/g, "").length < 10) return "Enter a WhatsApp number with at least 10 digits, e.g. +91 98765 43210.";
      if (f.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) return "That email address doesn't look right.";
    }
    return "";
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const problem = validStep();
    if (problem) return setErr(problem);
    if (step < steps.length - 1) return go(step + 1);
    setBusy(true);
    try {
      const scores = Object.fromEntries(pillars.map((p, i) => [p.key, result.got[i]]));
      const site = f.noWebsite ? "No website yet" : f.website.trim();
      await submitLandingLead({
        intent: "audit",
        name: f.name.trim().slice(0, 100),
        phone: f.phone.trim().slice(0, 30),
        email: f.email.trim().slice(0, 160) || undefined,
        company: f.company.trim().slice(0, 120),
        industry: f.industry.slice(0, 80) || undefined,
        website: site.slice(0, 200) || undefined,
        area: f.locations.trim().slice(0, 120) || undefined,
        revenue: f.revenue[0],
        targetRevenue: f.targetRevenue[0],
        channels: f.channels.slice(0, 10),
        preferredChannels: f.preferredChannels.slice(0, 10),
        budget: f.budget[0],
        score: result.total,
        weakest: result.order[0]?.p.name.slice(0, 120),
        scores,
        message: page.quiz.questions.map((q, i) => `${["No", "Partly", "Yes"][(answers[i] ?? 0) / 5]} · ${q.question}`).join("\n").slice(0, 1500),
        source: new URLSearchParams(window.location.search).get("src") ?? undefined,
        page: window.location.pathname,
      });
      onDone({ name: f.name.trim() });
    } catch {
      setErr("We couldn't send that. Check your connection and try again, or message us on WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  const last = step === steps.length - 1;
  return (
    <>
      <p className="eyebrow text-forest-500">Your 360° growth score</p>
      <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
        <Dial values={result.values} total={result.total} size={200} label="Your score" />
        <div className="grid min-w-0 gap-4">
          <p className="text-lg text-ink">{verdict}</p>
          <Bars pillars={pillars} values={result.values} max={result.max} />
        </div>
      </div>
      {fixes.length > 0 && (
        <div className="grid gap-3">
          <h3 className="text-lg font-bold text-ink">Fix in this order</h3>
          {fixes.map(({ p, i }) => (
            <div key={p.key} className="rounded-xl border border-ink/10 border-l-4 bg-white p-4" style={{ borderLeftColor: tone(result.values[i]) }}>
              <b className="block text-ink">
                {p.name} · {result.got[i]}/{result.max[i]}
              </b>
              <p className="mt-1 text-sm text-ink-muted">{p.fix}</p>
            </div>
          ))}
        </div>
      )}
      <form ref={formRef} onSubmit={submit} noValidate className="grid scroll-mt-4 gap-5 rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <div>
          <h3 className="text-xl font-bold text-ink">{page.quiz.formTitle}</h3>
          {step === 0 && page.quiz.formText && <p className="mt-1 text-sm text-ink-muted">{page.quiz.formText}</p>}
        </div>
        <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Form steps">
          {steps.map((label, i) => (
            <li key={label} className="grid gap-1.5" aria-current={i === step ? "step" : undefined}>
              <span className={cn("h-1.5 rounded-full", i <= step ? "bg-forest-500" : "bg-[#E4EBE6]")} />
              <span className={cn("truncate text-xs font-semibold", i === step ? "text-ink" : "text-ink-soft")}>
                {i + 1}. {label}
              </span>
            </li>
          ))}
        </ol>

        {current === "Your business" && (
          <>
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              Business name
              <input id="audit-company" className={lpInput} autoComplete="organization" value={f.company} onChange={text("company")} />
            </label>
            {businessTypes.length > 0 && (
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                Type of business
                <select id="audit-type" className={lpInput} value={f.industry} onChange={(e) => set("industry", e.target.value)}>
                  <option value="">Choose one</option>
                  {businessTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            )}
            <div className="grid gap-1.5">
              <label htmlFor="audit-website" className="text-sm font-semibold text-ink">
                Website <span className="font-normal text-ink-soft">(so we can review it)</span>
              </label>
              <input id="audit-website" className={cn(lpInput, f.noWebsite && "opacity-50")} type="url" inputMode="url" autoComplete="url" placeholder="mybusiness.in" disabled={f.noWebsite} value={f.website} onChange={text("website")} />
              <label className="mt-1 flex items-center gap-2.5 text-sm text-ink">
                <input id="audit-nowebsite" type="checkbox" className="h-5 w-5 accent-[#123B2A]" checked={f.noWebsite} onChange={(e) => set("noWebsite", e.target.checked)} />
                I don't have a website yet
              </label>
            </div>
            {page.quiz.areaLabel && (
              <label className="grid gap-1.5 text-sm font-semibold text-ink">
                {page.quiz.areaLabel}
                <input id="audit-locations" className={lpInput} placeholder="e.g. Madhapur, Gachibowli · 2 branches" value={f.locations} onChange={text("locations")} />
              </label>
            )}
          </>
        )}

        {current === "Your goals" && (
          <>
            {revenueRanges.length > 0 && (
              <>
                <Chips label="Monthly revenue today" options={revenueRanges} value={f.revenue} onChange={(v) => set("revenue", v)} />
                <Chips label="Monthly revenue you want in 12 months" options={revenueRanges} value={f.targetRevenue} onChange={(v) => set("targetRevenue", v)} />
              </>
            )}
            {contactChannels.length > 0 && (
              <>
                <Chips multi label="How do customers reach you today?" hint="Choose all that apply" options={contactChannels} value={f.channels} onChange={(v) => set("channels", v)} />
                <Chips multi label="How would you like customers to reach you?" hint="Choose all that apply" options={contactChannels} value={f.preferredChannels} onChange={(v) => set("preferredChannels", v)} />
              </>
            )}
            {budgetRanges.length > 0 && <Chips label="Monthly marketing budget" options={budgetRanges} value={f.budget} onChange={(v) => set("budget", v)} />}
            <p className="text-xs text-ink-soft">Your answers stay private. They help us size a plan that fits your business.</p>
          </>
        )}

        {current === "Your plan" && (
          <>
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              Your name
              <input id="audit-name" className={lpInput} autoComplete="name" value={f.name} onChange={text("name")} />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              <span>
                WhatsApp number <span className="font-normal text-ink-soft">(we send your plan here)</span>
              </span>
              <input id="audit-phone" className={lpInput} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98xxx xxxxx" value={f.phone} onChange={text("phone")} />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-ink">
              <span>
                Email <span className="font-normal text-ink-soft">(optional)</span>
              </span>
              <input id="audit-email" className={lpInput} type="email" autoComplete="email" value={f.email} onChange={text("email")} />
            </label>
            <p className="text-xs text-ink-soft">No cold calls. We only use your number to send your plan and follow up on it.</p>
          </>
        )}

        {err && (
          <p role="alert" className="text-sm text-[#9B2C2C]">
            {err}
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center">
          <button type="submit" disabled={busy} className={cn(lpBtn, "sm:flex-1")}>
            {busy && <Loader2 size={18} className="animate-spin" />} {last ? "Send me my growth plan" : "Continue"} {!last && <span aria-hidden="true">→</span>}
          </button>
          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)} className="min-h-[48px] rounded-full px-5 font-semibold text-ink-muted hover:text-ink">
              ← Back
            </button>
          )}
        </div>
      </form>
    </>
  );
}
