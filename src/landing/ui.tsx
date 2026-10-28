import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useContact } from "@/content/ContentProvider";
import { cn } from "@/lib/utils";
import type { LpSection, QuizPillar } from "./types";

/** Renders "*words*" as accent italics (Playfair, via .font-display em). */
export function Accent({ text, emClass }: { text: string; emClass?: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <em key={i} className={emClass}>
            {p}
          </em>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export function LpHeader({ tag, right }: { tag?: string; right?: ReactNode }) {
  return (
    <header className="on-dark absolute inset-x-0 top-0 z-20 text-ivory">
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="Springs 360 home">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          {right}
          {tag && <span className="eyebrow hidden rounded-full border border-gold/40 px-3 py-2 text-[0.68rem] text-gold-light xs:inline-block">{tag}</span>}
        </div>
      </div>
    </header>
  );
}

export function LpFooter() {
  const contact = useContact();
  return (
    <footer className="border-t border-ink/10 bg-ivory-100">
      <div className="container-site flex flex-col gap-3 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Springs 360 · Hyderabad</span>
        <span className="flex flex-wrap gap-x-5 gap-y-2">
          <Link to="/" className="hover:text-ink">springs360.in</Link>
          {contact.phoneDisplay && <span>{contact.phoneDisplay}</span>}
          <Link to="/privacy" className="hover:text-ink">Privacy</Link>
          <Link to="/terms" className="hover:text-ink">Terms</Link>
        </span>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp({ text }: { text?: string }) {
  const contact = useContact();
  const href = text ? `${contact.whatsappBase}?text=${encodeURIComponent(text)}` : contact.whatsappHref;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F8F55] text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-105"
      style={{ right: "max(1.25rem, env(safe-area-inset-right))", bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <MessageCircle size={26} />
    </a>
  );
}

export const lpBtn =
  "inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-gold px-7 text-base font-semibold text-deep shadow-[0_14px_34px_-14px_rgba(184,155,98,0.9)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-gold-light disabled:opacity-60";
export const lpBtnDark = "inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-forest px-7 text-base font-semibold text-ivory transition-colors hover:bg-deep disabled:opacity-60";
export const lpInput =
  "block w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-soft/70 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15";

function Head({ s }: { s: LpSection }) {
  return (
    <div className="mb-10 max-w-3xl">
      {s.eyebrow && <p className="eyebrow text-forest-500">{s.eyebrow}</p>}
      {s.title && (
        <h2 className="mt-4 text-balance font-display text-display-md font-bold text-ink">
          <Accent text={s.title} emClass="text-forest-500" />
        </h2>
      )}
      {s.text && s.kind !== "chips" && <p className="mt-4 max-w-2xl text-lead text-ink-muted">{s.text}</p>}
    </div>
  );
}

/** Small ring with one highlighted segment, echoing the 360° score dial. */
export function SegmentMark({ index, count }: { index: number; count: number }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const seg = c / count;
  return (
    <svg viewBox="0 0 38 38" className="h-10 w-10" aria-hidden="true">
      {Array.from({ length: count }, (_, j) => (
        <circle key={j} cx="19" cy="19" r={r} fill="none" stroke={j === index ? "#2C6A4F" : "#DCE7DE"} strokeWidth="6" strokeDasharray={`${seg - 1.6} ${c}`} transform={`rotate(${-90 + (j * 360) / count} 19 19)`} />
      ))}
    </svg>
  );
}

function Faq({ items }: { items: LpSection["items"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl border-t border-ink/10">
      {items.map((it, i) => (
        <div key={i} className="border-b border-ink/10">
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-semibold text-ink">
            {it.title}
            <ChevronDown size={20} className={cn("shrink-0 text-forest-500 transition-transform", open === i && "rotate-180")} />
          </button>
          {open === i && <p className="max-w-prose pb-6 text-ink-muted">{it.text}</p>}
        </div>
      ))}
    </div>
  );
}

export function Section({ s, pillars }: { s: LpSection; pillars?: QuizPillar[] }) {
  const items = s.items.filter((x) => x.title || x.text);
  // On quiz pages an empty card section shows the quiz pillars.
  const cards = s.kind === "cards" && !items.length && pillars?.length ? pillars.map((p) => ({ title: p.name, text: p.description })) : items;
  return (
    <section className="border-t border-ink/10 py-16 sm:py-24">
      <div className="container-site">
        <Head s={s} />
        {s.kind === "cards" && (
          <div className={cn("grid gap-4 sm:grid-cols-2", cards.length >= 5 ? "lg:grid-cols-5" : cards.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
            {cards.map((it, i) => (
              <div key={i} className="flex min-w-0 flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-6">
                <SegmentMark index={i} count={cards.length} />
                <h3 className="text-lg font-bold text-ink">{it.title}</h3>
                <p className="text-[0.95rem] text-ink-muted">{it.text}</p>
              </div>
            ))}
          </div>
        )}
        {s.kind === "list" && (
          <dl className="grid border-t border-ink/10 sm:grid-cols-2">
            {items.map((it, i) => (
              <div key={i} className={cn("border-b border-ink/10 py-6 sm:py-7", i % 2 === 0 ? "sm:border-r sm:pr-8" : "sm:pl-8")}>
                <dt className="text-xl font-bold text-ink">{it.title}</dt>
                <dd className="mt-2 text-ink-muted">{it.text}</dd>
              </div>
            ))}
          </dl>
        )}
        {s.kind === "steps" && (
          <ol className={cn("grid gap-8", items.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3")}>
            {items.map((it, i) => (
              <li key={i} className="flex flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-forest-500 font-semibold tabular-nums text-forest-500">{i + 1}</span>
                <h3 className="text-xl font-bold text-ink">{it.title}</h3>
                <p className="text-ink-muted">{it.text}</p>
              </li>
            ))}
          </ol>
        )}
        {s.kind === "chips" && (
          <>
            <div className="flex flex-wrap gap-2.5">
              {items.map((it, i) => (
                <span key={i} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[0.95rem] text-ink">
                  {it.title}
                </span>
              ))}
            </div>
            {s.text && <p className="mt-6 max-w-2xl text-ink-muted">{s.text}</p>}
          </>
        )}
        {s.kind === "faq" && <Faq items={items} />}
        {s.kind === "testimonials" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <figure key={i} className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-6">
                <blockquote className="font-accent text-xl italic leading-snug text-ink">“{it.text}”</blockquote>
                <figcaption className="text-sm font-semibold text-ink-muted">{it.title}</figcaption>
              </figure>
            ))}
          </div>
        )}
        {s.kind === "text" && (
          <div className="max-w-prose space-y-4 text-lead text-ink-muted">
            {items.map((it, i) => (
              <div key={i}>
                {it.title && <h3 className="mb-2 text-xl font-bold text-ink">{it.title}</h3>}
                <p className="whitespace-pre-line">{it.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Formats a price, e.g. ₹4,999 or $59. */
export function money(amount: number, currency = "INR") {
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", { style: "currency", currency, maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center bg-deep/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className={cn("max-h-[92svh] w-full overflow-y-auto rounded-t-3xl bg-ivory-50 shadow-2xl sm:rounded-3xl", wide ? "sm:max-w-3xl" : "sm:max-w-lg")} style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink/10 bg-ivory-50/95 px-5 py-4 backdrop-blur sm:px-7">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-muted hover:bg-ink/5" autoFocus>
            Close
          </button>
        </div>
        <div className="px-5 py-6 sm:px-7">{children}</div>
      </div>
    </div>
  );
}
