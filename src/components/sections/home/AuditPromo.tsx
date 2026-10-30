import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { fetchLandingPage } from "@/landing/api";
import { builtInPages } from "@/landing/defaults";
import { ExampleCard } from "@/landing/Audit";
import { Accent } from "@/landing/ui";
import type { LandingPage } from "@/landing/types";

/**
 * Home page block that sends visitors to the free audit (springs360.in/audit).
 * Texts follow the audit page edited in /admin → Landing pages.
 */
export function AuditPromo() {
  const [page, setPage] = useState<LandingPage>(() => builtInPages.audit());
  useEffect(() => {
    fetchLandingPage("audit")
      .then((p) => p && p.template === "audit" && setPage(p))
      .catch(() => {});
  }, []);

  const points = page.quiz.pillars.slice(0, 5).map((p) => p.name);
  return (
    <section aria-labelledby="audit-promo-title" className="on-dark relative isolate overflow-hidden bg-deep text-ivory">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_10%,rgba(184,155,98,0.16),transparent_55%)]" />
      <div className="container-site grid items-center gap-12 py-section lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-7">
          <Reveal>
            <Eyebrow light>{page.tag || "Free growth audit"}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="audit-promo-title" className="mt-7 text-balance font-display text-display-lg">
              <Accent text={page.hero.headline} emClass="text-gold-light" />
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-lead text-ivory/75">{page.hero.text}</p>
          </Reveal>
          {points.length > 0 && (
            <Reveal delay={0.14}>
              <ul className="mt-8 grid max-w-xl gap-2.5 text-ivory/85 sm:grid-cols-2">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5">
                    <Check size={17} className="shrink-0 text-gold-light" aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          <Reveal delay={0.18} className="mt-10 flex flex-col gap-4 xs:flex-row xs:flex-wrap xs:items-center xs:gap-6">
            <Link
              to="/audit?start=1"
              className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-gold px-7 text-base font-semibold text-deep shadow-[0_14px_34px_-14px_rgba(184,155,98,0.9)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-gold-light"
            >
              {page.hero.ctaLabel} <span aria-hidden="true">→</span>
            </Link>
            {page.hero.ctaNote && <span className="text-sm text-ivory/60">{page.hero.ctaNote}</span>}
          </Reveal>
        </div>
        <Reveal delay={0.1} className="min-w-0 lg:col-span-5">
          <div className="mx-auto max-w-md">
            <ExampleCard page={page} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
