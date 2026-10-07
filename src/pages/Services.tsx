import { Link } from "react-router-dom";
import { Seo, breadcrumbLd, faqLd, professionalServiceLd } from "@/lib/seo";
import { pillars } from "@/data/services";
import { growthStages } from "@/data/growthSystem";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { CoverArt } from "@/components/art/CoverArt";
import { Reveal } from "@/components/animations/Reveal";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqList } from "@/components/sections/FaqList";

const engagementFaqs = [
  {
    question: "Do we have to use all five capabilities?",
    answer:
      "No. Many clients start with the stage where growth is most constrained — often acquisition, conversion or follow-up — and expand once that is working. We will always show you how the piece we build fits the wider system.",
  },
  {
    question: "How are engagements structured?",
    answer:
      "Typically a short diagnostic or strategy phase, followed by a build phase and an ongoing optimisation retainer. Scope and fees are agreed after the strategy call, once we understand your goals and current setup.",
  },
  {
    question: "Who owns the accounts, data and assets?",
    answer:
      "You do. Ad accounts, analytics, CRM, websites and creative are set up in your name. If we stop working together, everything stays with you.",
  },
];

export default function Services() {
  return (
    <>
      <Seo
        title="Services — Strategy, Performance, Digital, AI & Data"
        description="Five connected capabilities — strategy, performance marketing, digital experience, AI & automation, and data & intelligence — organised around the full customer journey."
        path="/services"
        jsonLd={[
          professionalServiceLd({ path: "/services", serviceTypes: pillars.flatMap((p) => p.services.map((s) => s.name)) }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          faqLd(engagementFaqs),
        ]}
      />
      <PageHero
        eyebrow="Services"
        titleLines={["Every capability", <em key="e" className="italic">a growth system needs.</em>]}
        intro="Organised into five disciplines that map to the customer journey. Use one to fix a constraint — or connect all five."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        art={{ seed: "services-hero", variant: "flow" }}
      >
        <nav aria-label="Capabilities on this page">
          <ul className="flex flex-wrap gap-2">
            {pillars.map((p) => (
              <li key={p.slug}>
                <a href={`#${p.slug}`} className="inline-flex min-h-[40px] items-center rounded-sm border border-ivory/20 px-4 text-sm text-ivory/85 transition-colors hover:border-ivory hover:text-ivory">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="bg-ivory">
        {pillars.map((p, idx) => (
          <section key={p.slug} id={p.slug} aria-labelledby={`${p.slug}-title`} className="scroll-mt-20 border-b border-ink/10 py-section-sm">
            <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className={idx % 2 ? "lg:order-2 lg:col-span-5 lg:col-start-8" : "lg:col-span-5"}>
                <Link to={`/services/${p.slug}`} className="group/btn block overflow-hidden rounded" tabIndex={-1} aria-hidden="true">
                  <div className="aspect-[4/3] transition-transform duration-[900ms] ease-editorial group-hover/btn:scale-[1.03]">
                    <CoverArt seed={p.slug} variant={p.art} tone={idx % 2 ? "sage" : "forest"} />
                  </div>
                </Link>
              </Reveal>
              <div className={idx % 2 ? "lg:order-1 lg:col-span-6 lg:col-start-1" : "lg:col-span-6 lg:col-start-7"}>
                <Reveal>
                  <Eyebrow index={p.index}>{p.name}</Eyebrow>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 id={`${p.slug}-title`} className="mt-6 font-display text-display-md text-ink">
                    {p.headline}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-6 text-lead text-ink-muted">{p.summary}</p>
                </Reveal>
                <Reveal delay={0.14}>
                  <ul className="mt-8 border-t border-ink/15">
                    {p.services.map((s) => (
                      <li key={s.name} className="border-b border-ink/15">
                        {s.slug ? (
                          <Link to={`/services/${s.slug}`} className="group/btn flex min-h-[52px] items-center justify-between gap-4 py-3 text-ink">
                            <span className="link-underline">{s.name}</span>
                            <Arrow className="text-ink/40 group-hover/btn:text-ink" />
                          </Link>
                        ) : (
                          <span className="flex min-h-[52px] items-center py-3 text-ink-muted">{s.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={0.18} className="mt-8">
                  <ButtonLink to={`/services/${p.slug}`} variant="outline">
                    Explore {p.name}
                  </ButtonLink>
                </Reveal>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="how-title" className="on-dark bg-deep py-section text-ivory">
        <div className="container-site">
          <SectionHeader
            light
            eyebrow="How capabilities connect"
            title={<span id="how-title">Mapped to the <em className="italic">customer journey.</em></span>}
            intro="Each stage of the Springs 360 Growth System is led by one discipline and supported by the others."
          />
          <ol className="mt-16 grid gap-px overflow-hidden rounded border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-5">
            {growthStages.map((s, i) => (
              <Reveal as="li" key={s.name} delay={i * 0.06} className="bg-deep p-6">
                <p className="text-sm tabular-nums text-gold-light">{s.index}</p>
                <h3 className="mt-6 font-display text-2xl italic">{s.name}</h3>
                <p className="mt-3 text-sm text-ivory/70">{s.capabilities.join(" · ")}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-ivory py-section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Working together</Eyebrow>
            <h2 id="faq-title" className="mt-6 font-display text-display-md text-ink">Common questions</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={engagementFaqs} />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Not sure where to start?"
        title="Find your growth opportunity."
        body="In a 30-minute call we'll identify the stage where growth is most constrained and what we would do first — no obligation."
        cta="Find Your Growth Opportunity"
      />
    </>
  );
}
