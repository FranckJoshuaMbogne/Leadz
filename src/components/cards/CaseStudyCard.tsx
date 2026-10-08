import { Link } from "react-router-dom";
import type { CaseStudy } from "@/data/caseStudies";
import { CoverArt } from "@/components/art/CoverArt";
import { IllustrativeBadge } from "@/components/ui/Tag";
import { Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MetricText } from "@/components/animations/Counter";

export function CaseStudyCard({ study, size = "md", className }: { study: CaseStudy; size?: "md" | "lg"; className?: string }) {
  return (
    <article className={cn("group/btn relative", className)}>
      <Link to={`/work/${study.slug}`} className="block">
        <div className={cn("relative overflow-hidden rounded", size === "lg" ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/3]")}>
          <div className="h-full w-full transition-transform duration-[900ms] ease-editorial group-hover/btn:scale-[1.04]">
            <CoverArt seed={study.slug} variant={study.art.variant} tone={study.art.tone} />
          </div>
          <div className="absolute left-4 top-4 flex gap-2">
            {!study.verified && <IllustrativeBadge light={study.art.tone === "deep" || study.art.tone === "forest"} />}
          </div>
          <dl className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-px bg-gradient-to-t from-deep/85 to-transparent p-4 pt-14 text-ivory sm:p-5 sm:pt-16">
            {study.metrics.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd className="font-display text-xl sm:text-2xl"><MetricText value={m.value} /></dd>
                <p aria-hidden="true" className="mt-1 text-[0.7rem] leading-tight text-ivory/75 sm:text-xs">{m.label}</p>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-ink-muted">
              {study.industry} · {study.client}
            </p>
            <h3 className={cn("mt-3 font-display text-ink", size === "lg" ? "text-display-sm" : "text-[1.45rem] leading-snug")}>{study.title}</h3>
          </div>
          <span className="mt-8 hidden text-ink sm:block">
            <Arrow />
          </span>
        </div>
      </Link>
    </article>
  );
}
