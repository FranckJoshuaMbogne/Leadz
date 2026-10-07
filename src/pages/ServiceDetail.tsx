import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbLd, faqLd, serviceLd } from "@/lib/seo";
import { getPillar, getService, servicesForPillar, type Pillar, type Service } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import { staticInsights } from "@/data/insights";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { InsightCard } from "@/components/cards/InsightCard";
import NotFound from "./NotFound";

function Approach({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 0.06} className="bg-ivory-50 p-7">
          <p className="text-sm tabular-nums text-gold-dark">0{i + 1}</p>
          <h3 className="mt-8 font-display text-2xl text-ink">{s.title}</h3>
          <p className="mt-3 text-ink-muted">{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="eyebrow text-ink-muted">{title}</h3>
      <ul className="mt-5 border-t border-ink/15">
        {items.map((it) => (
          <li key={it} className="flex gap-4 border-b border-ink/15 py-4 text-ink">
            <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-gold" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedWork({ serviceSlugs }: { serviceSlugs: string[] }) {
  const work = caseStudies.filter((c) => c.services.some((s) => serviceSlugs.includes(s))).slice(0, 2);
  if (!work.length) return null;
  return (
    <section aria-labelledby="related-work" className="bg-sage-100 py-section-sm">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <h2 id="related-work" className="font-display text-display-md text-ink">
            Related work
          </h2>
          <ButtonLink to="/work" variant="text" className="hidden sm:inline-flex">
            All work
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8">
          {work.map((w) => (
            <Reveal key={w.slug}>
              <CaseStudyCard study={w} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedInsights({ serviceSlugs }: { serviceSlugs: string[] }) {
  const list = staticInsights.filter((i) => i.relatedService && serviceSlugs.includes(i.relatedService)).slice(0, 3);
  if (!list.length) return null;
  return (
    <section aria-labelledby="related-insights" className="bg-ivory py-section-sm">
      <div className="container-site">
        <h2 id="related-insights" className="font-display text-display-md text-ink">
          Further reading
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
          {list.map((i) => (
            <Reveal key={i.slug}>
              <InsightCard insight={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarPage({ pillar }: { pillar: Pillar }) {
  const detail = servicesForPillar(pillar.slug);
  const path = `/services/${pillar.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: pillar.name, path },
  ];
  return (
    <>
      <Seo
        title={`${pillar.name} Services`}
        description={pillar.summary}
        path={path}
        jsonLd={[serviceLd({ name: pillar.name, description: pillar.summary, path }), breadcrumbLd(crumbs), faqLd(pillar.faqs)]}
      />
      <PageHero eyebrow={`${pillar.index} — ${pillar.name}`} titleLines={[pillar.headline]} intro={pillar.summary} breadcrumbs={crumbs} art={{ seed: pillar.slug, variant: pillar.art }}>
        <ButtonLink to="/book" variant="light" size="lg">
          {pillar.cta}
        </ButtonLink>
      </PageHero>

      <section aria-labelledby="problem" className="bg-ivory py-section">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>The problem</Eyebrow>
          </div>
          <Reveal className="lg:col-span-8">
            <p id="problem" className="font-display text-display-sm text-ink">
              {pillar.problem}
            </p>
          </Reveal>
        </div>
        <div className="container-site mt-section-sm">
          <Eyebrow>Our approach</Eyebrow>
          <div className="mt-10">
            <Approach steps={pillar.approach} />
          </div>
        </div>
      </section>

      <section aria-labelledby="services-list" className="bg-ivory pb-section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="services-list" className="eyebrow text-ink-muted">
              Services
            </h2>
            <ul className="mt-5 border-t border-ink/15">
              {pillar.services.map((s) => {
                const d = detail.find((x) => x.slug === s.slug);
                return (
                  <li key={s.name} className="border-b border-ink/15">
                    {s.slug ? (
                      <Link to={`/services/${s.slug}`} className="group/btn flex items-start justify-between gap-6 py-6">
                        <span>
                          <span className="block font-display text-2xl text-ink">{s.name}</span>
                          {d && <span className="mt-1.5 block text-ink-muted">{d.short}</span>}
                        </span>
                        <Arrow className="mt-3 text-ink/40 group-hover/btn:text-ink" />
                      </Link>
                    ) : (
                      <p className="py-6 font-display text-2xl text-ink/70">{s.name}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <ListBlock title="What we measure" items={pillar.measures} />
          </div>
        </div>
      </section>

      <RelatedWork serviceSlugs={detail.map((d) => d.slug)} />

      <section aria-labelledby="faq" className="bg-ivory py-section-sm">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <h2 id="faq" className="font-display text-display-md text-ink lg:col-span-4">
            Questions
          </h2>
          <div className="lg:col-span-8">
            <FaqList faqs={pillar.faqs} />
          </div>
        </div>
      </section>

      <RelatedInsights serviceSlugs={detail.map((d) => d.slug)} />
      <CtaBand title="Find your growth opportunity." cta="Find Your Growth Opportunity" />
    </>
  );
}

function ServicePage({ service }: { service: Service }) {
  const pillar = getPillar(service.pillar)!;
  const path = `/services/${service.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: pillar.name, path: `/services/${pillar.slug}` },
    { name: service.name, path },
  ];
  const related = service.related.map(getService).filter(Boolean) as Service[];

  return (
    <>
      <Seo
        title={service.name}
        description={`${service.short} ${service.intro}`.slice(0, 300)}
        path={path}
        jsonLd={[serviceLd({ name: service.name, description: service.intro, path, category: pillar.name }), breadcrumbLd(crumbs)]}
      />
      <PageHero eyebrow={pillar.name} titleLines={[service.name]} intro={service.short} breadcrumbs={crumbs} art={{ seed: service.slug, variant: pillar.art }}>
        <ButtonLink to="/book" variant="light" size="lg">
          Find Your Growth Opportunity
        </ButtonLink>
      </PageHero>

      <section className="bg-ivory py-section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="font-display text-display-sm text-ink">{service.intro}</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <h2 className="eyebrow text-ink-muted">Why it matters</h2>
            <p className="mt-5 text-ink-muted">{service.problem}</p>
          </Reveal>
        </div>

        <div className="container-site mt-section-sm">
          <h2 className="eyebrow text-ink-muted">How we do it</h2>
          <div className="mt-8">
            <Approach steps={service.approach} />
          </div>
        </div>

        <div className="container-site mt-section-sm grid gap-14 md:grid-cols-2 lg:grid-cols-3">
          <ListBlock title="What you get" items={service.deliverables} />
          <ListBlock title="What we measure" items={service.measures} />
          <div>
            <h3 className="eyebrow text-ink-muted">A good fit if…</h3>
            <p className="mt-5 border-t border-ink/15 pt-5 text-ink">{service.fit}</p>
            <div className="mt-8 rounded bg-sage-100 p-6">
              <p className="text-sm text-ink-muted">Part of the {pillar.name} discipline.</p>
              <Link to={`/services/${pillar.slug}`} className="group/btn mt-3 inline-flex items-center gap-3 font-medium text-ink">
                <span className="link-underline">Explore {pillar.name}</span> <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedWork serviceSlugs={[service.slug]} />

      {related.length > 0 && (
        <section aria-labelledby="related-services" className="bg-ivory py-section-sm">
          <div className="container-site">
            <h2 id="related-services" className="font-display text-display-md text-ink">
              Works well with
            </h2>
            <ul className="mt-10 grid border-t border-ink/15 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="border-b border-ink/15 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
                  <Link to={`/services/${r.slug}`} className="group/btn block py-8">
                    <span className="font-display text-2xl text-ink">{r.name}</span>
                    <span className="mt-2 block text-ink-muted">{r.short}</span>
                    <span className="mt-5 inline-block text-ink">
                      <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <RelatedInsights serviceSlugs={[service.slug, ...service.related]} />
      <CtaBand title="Find your growth opportunity." cta="Find Your Growth Opportunity" />
    </>
  );
}

export default function ServiceDetail() {
  const { slug = "" } = useParams();
  const pillar = getPillar(slug);
  if (pillar) return <PillarPage pillar={pillar} />;
  const service = getService(slug);
  if (service) return <ServicePage service={service} />;
  return <NotFound />;
}
