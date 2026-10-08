import { useMemo, useState } from "react";
import { Seo, breadcrumbLd } from "@/lib/seo";
import { sortedCaseStudies, hasVerifiedWork } from "@/data/caseStudies";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

export default function Work() {
  const industries = useMemo(() => ["All", ...Array.from(new Set(sortedCaseStudies.map((c) => c.industry)))], []);
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? sortedCaseStudies : sortedCaseStudies.filter((c) => c.industry === filter);

  return (
    <>
      <Seo
        title="Work — Growth Systems in Practice"
        description="How Springs 360 approaches growth problems across acquisition, conversion, automation and data — the challenge, the system and the measures that matter."
        path="/work"
        jsonLd={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])]}
      />
      <PageHero
        eyebrow="Selected work"
        titleLines={["Growth systems,", <em key="i" className="italic">in practice.</em>]}
        intro="Each engagement connects strategy, channels, technology and measurement around one goal. Here is how that looks."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ]}
        art={{ seed: "work-hero", variant: "contour" }}
      />

      <section className="bg-ivory py-section-sm">
        <div className="container-site">
          {!hasVerifiedWork && (
            <Reveal className="mb-12 rounded border border-gold/40 bg-gold/10 p-5 text-[0.95rem] text-ink sm:p-6">
              <p>
                <strong className="font-semibold">A note on these examples.</strong> The scenarios below are illustrative —
                they show how we structure engagements and what we measure, using representative situations rather than named
                client results. Verified case studies will be published here with client approval.
              </p>
            </Reveal>
          )}

          <div role="group" aria-label="Filter by industry" className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-2 [scrollbar-width:none]">
            {industries.map((ind) => (
              <button
                key={ind}
                type="button"
                aria-pressed={filter === ind}
                onClick={() => setFilter(ind)}
                className={cn(
                  "min-h-[42px] shrink-0 rounded-sm border px-4 text-sm transition-colors",
                  filter === ind ? "border-forest bg-forest text-ivory" : "border-ink/20 text-ink-muted hover:border-ink hover:text-ink"
                )}
              >
                {ind}
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            {list.length} {list.length === 1 ? "example" : "examples"} shown
          </p>

          <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
            {list.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 2) * 0.08} className={i % 2 ? "md:mt-24" : undefined}>
                <CaseStudyCard study={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Your business next" title="Build something similar." cta="Build Something Similar" />
    </>
  );
}
