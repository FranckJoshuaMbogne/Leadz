import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbLd } from "@/lib/seo";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import { getService } from "@/data/services";
import { CoverArt } from "@/components/art/CoverArt";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IllustrativeBadge, Tag } from "@/components/ui/Tag";
import { Counter } from "@/components/animations/Counter";
import { Reveal } from "@/components/animations/Reveal";
import { Parallax } from "@/components/animations/Parallax";
import { MaskText } from "@/components/animations/MaskText";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Arrow } from "@/components/ui/Button";
import NotFound from "./NotFound";

function Row({ label, index, children }: { label: string; index: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-ink/15 py-10 md:grid-cols-12 md:gap-8">
      <h2 className="eyebrow flex gap-3 text-ink-muted md:col-span-3">
        <span className="tabular-nums text-gold-dark">{index}</span>
        {label}
      </h2>
      <div className="md:col-span-9">{children}</div>
    </Reveal>
  );
}

export default function CaseStudyPage() {
  const { slug = "" } = useParams();
  const study = getCaseStudy(slug);
  if (!study) return <NotFound />;

  const path = `/work/${study.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: study.client, path },
  ];
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length];

  return (
    <>
      <Seo
        title={`${study.title}${study.verified ? ` — ${study.client}` : ""}`}
        description={study.summary}
        path={path}
        jsonLd={[breadcrumbLd(crumbs)]}
      />

      <section className="on-dark bg-deep text-ivory">
        <div className="container-site pb-14 pt-32 md:pt-44">
          <Breadcrumbs items={crumbs} light className="anim-fade-up mb-10" />
          <div className="anim-fade-up flex flex-wrap items-center gap-3" style={{ animationDelay: "0.05s" }}>
            {!study.verified && <IllustrativeBadge light />}
            <span className="eyebrow text-ivory/70">
              {study.industry} · {study.client}
            </span>
          </div>
          <h1 className="mt-7 max-w-5xl font-display text-display-xl">
            <MaskText lines={[study.title]} delay={0.1} />
          </h1>
          <p className="anim-fade-up mt-8 max-w-2xl text-lead text-ivory/75" style={{ animationDelay: "0.35s" }}>
            {study.summary}
          </p>
        </div>
        <div className="container-site pb-0">
          <Parallax className="aspect-[16/9] rounded-t md:aspect-[21/9]" strength={30}>
            <CoverArt seed={study.slug} variant={study.art.variant} tone={study.art.tone === "deep" ? "forest" : study.art.tone} />
          </Parallax>
        </div>
      </section>

      <section aria-label="Key metrics" className="bg-forest text-ivory">
        <div className="container-site">
          <dl className="grid divide-y divide-ivory/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {study.metrics.map((m) => (
              <div key={m.label} className="py-10 sm:px-8 sm:first:pl-0">
                <dt className="text-sm text-ivory/65">{m.label}</dt>
                <dd className="mt-3 font-display text-display-lg">
                  <Counter value={m.value} />
                </dd>
              </div>
            ))}
          </dl>
          {!study.verified && (
            <p className="border-t border-ivory/10 py-4 text-xs text-ivory/60">Illustrative figures for a representative scenario — not a reported client result.</p>
          )}
        </div>
      </section>

      <article className="bg-ivory py-section-sm">
        <div className="container-site">
          <dl className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Client", study.client],
              ["Industry", study.industry],
              ["Channels", study.channels.join(", ")],
              ["Technology", study.technology.join(", ")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow text-ink-muted">{k}</dt>
                <dd className="mt-3 text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <Row index="01" label="Challenge">
            <p className="font-display text-display-sm text-ink">{study.challenge}</p>
          </Row>
          <Row index="02" label="Objective">
            <p className="text-lead text-ink">{study.objective}</p>
          </Row>
          <Row index="03" label="Strategy">
            <p className="text-lead text-ink">{study.strategy}</p>
          </Row>
          <Row index="04" label="Implementation">
            <ol className="space-y-4">
              {study.implementation.map((it, i) => (
                <li key={it} className="flex gap-5 text-lead text-ink">
                  <span className="mt-1 text-sm tabular-nums text-gold-dark">0{i + 1}</span>
                  {it}
                </li>
              ))}
            </ol>
          </Row>
          <Row index="05" label="Channels & technology">
            <div className="flex flex-wrap gap-2">
              {[...study.channels, ...study.technology].map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Row>
          <Row index="06" label="Results">
            <ul className="space-y-4">
              {study.results.map((r) => (
                <li key={r} className="flex gap-4 text-lead text-ink">
                  <span aria-hidden="true" className="mt-3.5 h-px w-4 shrink-0 bg-gold" />
                  {r}
                </li>
              ))}
            </ul>
          </Row>
          <Row index="07" label="Lessons">
            <div className="space-y-6">
              {study.lessons.map((l) => (
                <p key={l} className="border-l border-gold pl-6 font-display text-display-sm italic text-forest">
                  {l}
                </p>
              ))}
            </div>
          </Row>
          {study.verified && study.testimonial && (
            <Row index="08" label="In their words">
              <figure>
                <blockquote className="font-display text-display-sm text-ink">“{study.testimonial.quote}”</blockquote>
                <figcaption className="mt-4 text-ink-muted">
                  {study.testimonial.author}, {study.testimonial.role}
                </figcaption>
              </figure>
            </Row>
          )}
          <Row index={study.verified && study.testimonial ? "09" : "08"} label="Services involved">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {study.services.map((s) => {
                const svc = getService(s);
                return svc ? (
                  <li key={s}>
                    <Link to={`/services/${s}`} className="group/btn inline-flex items-center gap-3 text-ink">
                      <span className="link-underline">{svc.name}</span> <Arrow />
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </Row>
        </div>
      </article>

      <section aria-labelledby="next-work" className="bg-sage-100 py-section-sm">
        <div className="container-site grid gap-10 md:grid-cols-12 md:items-center">
          <h2 id="next-work" className="font-display text-display-md text-ink md:col-span-5">
            Next
          </h2>
          <div className="md:col-span-7">
            <CaseStudyCard study={next} />
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Your business next" title="Build something similar." cta="Build Something Similar" />
    </>
  );
}
