import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbLd } from "@/lib/seo";
import { getIndustry, industries } from "@/data/industries";
import { getService, getPillar } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Arrow } from "@/components/ui/Button";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import NotFound from "./NotFound";

export default function IndustryPage() {
  const { slug = "" } = useParams();
  const ind = getIndustry(slug);
  if (!ind) return <NotFound />;
  const path = `/industries/${ind.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: ind.name, path },
  ];
  const work = caseStudies.filter((c) => c.industrySlug === ind.slug);
  const others = industries.filter((i) => i.slug !== ind.slug).slice(0, 4);

  return (
    <>
      <Seo
        title={`Growth Marketing for ${ind.name}`}
        description={`${ind.summary} ${ind.solution}`.slice(0, 300)}
        path={path}
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <PageHero eyebrow="Industries" titleLines={[ind.name]} intro={ind.summary} breadcrumbs={crumbs} art={{ seed: ind.slug, variant: ind.art }} />

      <section className="bg-ivory py-section">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index="01">The business problem</Eyebrow>
            <ul className="mt-8 border-t border-ink/15">
              {ind.problems.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 0.06} className="flex gap-5 border-b border-ink/15 py-6 font-display text-2xl leading-snug text-ink">
                  <span className="mt-1.5 font-sans text-sm tabular-nums text-gold-dark">0{i + 1}</span>
                  {p}
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Eyebrow index="02">The Springs 360 approach</Eyebrow>
            <Reveal>
              <p className="mt-8 font-display text-display-sm text-ink">{ind.solution}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="caps" className="bg-sage-100 py-section-sm">
        <div className="container-site">
          <Eyebrow index="03">Relevant capabilities</Eyebrow>
          <h2 id="caps" className="sr-only">
            Relevant capabilities
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {ind.capabilities.map((c) => {
              const s = getService(c);
              if (!s) return null;
              return (
                <li key={c} className="bg-ivory-50">
                  <Link to={`/services/${s.slug}`} className="group/btn flex h-full flex-col p-7">
                    <span className="eyebrow text-ink-soft">{getPillar(s.pillar)?.name}</span>
                    <span className="mt-6 font-display text-2xl text-ink">{s.name}</span>
                    <span className="mt-3 flex-1 text-ink-muted">{s.short}</span>
                    <Arrow className="mt-6 text-ink" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {work.length > 0 && (
        <section aria-labelledby="ind-work" className="bg-ivory py-section-sm">
          <div className="container-site">
            <h2 id="ind-work" className="font-display text-display-md text-ink">
              Related work
            </h2>
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8">
              {work.map((w) => (
                <CaseStudyCard key={w.slug} study={w} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="other-ind" className="bg-ivory pb-section-sm pt-section-sm">
        <div className="container-site">
          <h2 id="other-ind" className="eyebrow text-ink-muted">
            Other industries
          </h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={`/industries/${o.slug}`} className="group/btn inline-flex items-center gap-3 font-display text-2xl text-ink">
                  <span className="link-underline">{o.name}</span> <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand eyebrow={ind.name} title="Talk to a growth strategist." cta="Talk to a Growth Strategist" />
    </>
  );
}
