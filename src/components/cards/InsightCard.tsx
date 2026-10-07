import { Link } from "react-router-dom";
import type { InsightMeta } from "@/data/insights";
import { CoverArt } from "@/components/art/CoverArt";
import { cn, formatDate } from "@/lib/utils";

export function InsightCover({ insight, className, eager = false }: { insight: InsightMeta; className?: string; eager?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded bg-sage", className)}>
      <div className="h-full w-full transition-transform duration-[900ms] ease-editorial group-hover/card:scale-[1.04]">
        {insight.coverImage ? (
          <img
            src={insight.coverImage}
            alt={insight.coverAlt ?? ""}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <CoverArt seed={insight.slug} variant={insight.art?.variant} tone={insight.art?.tone ?? "forest"} />
        )}
      </div>
    </div>
  );
}

export function InsightMetaLine({ insight, light = false }: { insight: InsightMeta; light?: boolean }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-sm", light ? "text-ivory/65" : "text-ink-soft")}>
      <time dateTime={insight.publishedAt}>{formatDate(insight.publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{insight.readingMinutes} min read</span>
    </p>
  );
}

export function InsightCard({ insight, featured = false, headingLevel = 3 }: { insight: InsightMeta; featured?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={cn("group/card", featured && "grid gap-8 md:grid-cols-12 md:items-center")}>
      <Link to={`/insights/${insight.slug}`} className={cn("block", featured && "md:col-span-7")} tabIndex={-1} aria-hidden="true">
        <InsightCover insight={insight} className={featured ? "aspect-[16/10]" : "aspect-[3/2]"} eager={featured} />
      </Link>
      <div className={cn(featured ? "md:col-span-5" : "mt-5")}>
        <p className="eyebrow text-gold-dark">{insight.category}</p>
        <H className={cn("mt-3 font-display text-ink", featured ? "text-display-md" : "text-[1.4rem] leading-snug")}>
          <Link to={`/insights/${insight.slug}`} className="bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 [background-image:linear-gradient(currentColor,currentColor)] group-hover/card:bg-[length:100%_1px]">
            {insight.title}
          </Link>
        </H>
        <p className={cn("mt-3 text-ink-muted", featured ? "text-lead" : "line-clamp-3 text-[0.97rem] leading-relaxed")}>{insight.excerpt}</p>
        <div className="mt-4">
          <InsightMetaLine insight={insight} />
        </div>
      </div>
    </article>
  );
}
