import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskText } from "@/components/animations/MaskText";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CoverArt, type ArtVariant } from "@/components/art/CoverArt";

/** Dark editorial hero for inner pages. */
export function PageHero({
  eyebrow,
  titleLines,
  intro,
  breadcrumbs,
  art,
  children,
  className,
}: {
  eyebrow: string;
  titleLines: ReactNode[];
  intro?: ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  art?: { seed: string; variant?: ArtVariant };
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("on-dark relative isolate overflow-hidden bg-deep text-ivory", className)}>
      {art && (
        <div aria-hidden="true" className="anim-fade-in absolute inset-y-0 right-0 -z-10 w-full opacity-40 md:w-[58%] md:opacity-70">
          <CoverArt seed={art.seed} variant={art.variant} tone="deep" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/70 to-transparent" />
        </div>
      )}
      <div className="container-site pb-16 pt-32 md:pb-24 md:pt-44">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} light className="anim-fade-up mb-10" />}
        <div className="anim-fade-up" style={{ animationDelay: "0.05s" }}>
          <Eyebrow light>{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-7 max-w-5xl font-display text-display-xl">
          <MaskText lines={titleLines} delay={0.1} />
        </h1>
        {intro && (
          <div className="anim-fade-up mt-8 max-w-2xl text-lead text-ivory/75" style={{ animationDelay: "0.35s" }}>
            {intro}
          </div>
        )}
        {children && (
          <div className="anim-fade-up mt-10" style={{ animationDelay: "0.45s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
