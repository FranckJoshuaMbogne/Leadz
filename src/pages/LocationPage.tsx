import { Link, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Seo, breadcrumbLd, faqLd, localBusinessLd } from "@/lib/seo";
import { useSite } from "@/content/useSite";
import { useContentState } from "@/content/ContentProvider";
import { PageLoading } from "@/components/ui/PageLoading";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import NotFound from "./NotFound";

/** Splits "in *Hyderabad.*" into text and accent italics. */
function Line({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <em key={i} className="italic">{p}</em> : <span key={i}>{p}</span>))}</>;
}

export default function LocationPage() {
  const { slug = "" } = useParams();
  const { getLocation, getService, locations } = useSite();
  const { ready } = useContentState();
  const loc = getLocation(slug);
  if (!loc) return ready ? <NotFound /> : <PageLoading />;

  const path = `/locations/${loc.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: loc.city, path },
  ];
  const services = loc.services.map(getService).filter(Boolean) as NonNullable<ReturnType<typeof getService>>[];
  const others = locations.filter((l) => l.slug !== loc.slug);
  const src = `src=${loc.slug}`;

  return (
    <>
      <Seo
        title={loc.seoTitle}
        description={loc.seoDescription}
        path={path}
        jsonLd={[localBusinessLd(loc, services.map((s) => ({ name: s.name, slug: s.slug }))), breadcrumbLd(crumbs), ...(loc.faqs.length ? [faqLd(loc.faqs)] : [])]}
      />
      <PageHero eyebrow={`${loc.city} · ${loc.region}`} titleLines={loc.headline.map((l, i) => <Line key={i} text={l} />)} intro={loc.intro} breadcrumbs={crumbs} art={{ seed: loc.slug, variant: loc.art }}>
        <div className="mt-10 flex flex-col gap-4 xs:flex-row xs:flex-wrap xs:items-center">
          <ButtonLink to={`/audit?start=1&${src}`} variant="light" size="lg">
            Get a free growth audit
          </ButtonLink>
          <ButtonLink to="/book" variant="outline-light" size="lg">
            Book a strategy call
          </ButtonLink>
        </div>
      </PageHero>

      <section aria-labelledby="loc-context" className="bg-ivory py-section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index="01">Marketing in {loc.city}</Eyebrow>
            <h2 id="loc-context" className="mt-6 font-display text-display-md text-ink">
              What brings customers in <em className="italic">{loc.city}.</em>
            </h2>
          </div>
          <div className="space-y-6 lg:col-span-7">
            {loc.context.filter(Boolean).map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-lead text-ink-muted">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section aria-labelledby="loc-services" className="bg-sage-100 py-section-sm">
          <div className="container-site">
            <Eyebrow index="02">Services in {loc.city}</Eyebrow>
            <h2 id="loc-services" className="mt-6 max-w-3xl font-display text-display-md text-ink">
              Everything your {loc.city} business needs to grow, from one team.
            </h2>
            <ul className="mt-10 grid gap-px overflow-hidden rounded border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <li key={s.slug} className="bg-ivory-50">
                  <Link to={`/services/${s.slug}`} className="group/btn flex h-full flex-col p-7">
                    <h3 className="font-display text-2xl text-ink">
                      {s.name} <span className="sr-only">in {loc.city}</span>
                    </h3>
                    <span className="mt-3 flex-1 text-ink-muted">{s.short}</span>
                    <Arrow className="mt-6 text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {loc.areas.length > 0 && (
        <section aria-labelledby="loc-areas" className="bg-ivory py-section-sm">
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow index="03">Areas we cover</Eyebrow>
              <h2 id="loc-areas" className="mt-6 font-display text-display-sm text-ink">
                Campaigns targeted to the neighbourhoods you serve in {loc.city}.
              </h2>
            </div>
            <ul className="flex flex-wrap content-start gap-2.5 lg:col-span-8">
              {loc.areas.map((a) => (
                <li key={a} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-[0.95rem] text-ink">
                  <MapPin size={14} className="text-gold-dark" aria-hidden="true" /> {a}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="loc-courses" className="on-dark bg-deep text-ivory">
        <div className="container-site grid items-center gap-10 py-section-sm lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow light>Learn it yourself</Eyebrow>
            <h2 id="loc-courses" className="mt-6 font-display text-display-md">
              Digital marketing courses for <em className="italic">{loc.city}</em> learners.
            </h2>
            <p className="mt-5 max-w-2xl text-lead text-ivory/75">Online video courses taught from real campaigns, with a private course group for projects and questions. Watch a free preview before you pay.</p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <ButtonLink to={`/training?${src}`} variant="light" size="lg">
              See the courses
            </ButtonLink>
          </div>
        </div>
      </section>

      {loc.faqs.length > 0 && (
        <section aria-labelledby="loc-faq" className="bg-ivory py-section-sm">
          <div className="container-site grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow index="04">Questions</Eyebrow>
              <h2 id="loc-faq" className="mt-6 font-display text-display-sm text-ink">
                Digital marketing in {loc.city}: your questions.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <FaqList faqs={loc.faqs} />
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="loc-other" className="bg-ivory pb-section-sm">
          <div className="container-site border-t border-ink/15 pt-10">
            <h2 id="loc-other" className="eyebrow text-ink-muted">
              We also work in
            </h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link to={`/locations/${o.slug}`} className="group/btn inline-flex items-center gap-3 font-display text-2xl text-ink">
                    <span className="link-underline">Digital marketing in {o.city}</span> <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand eyebrow={loc.city} title={`More customers in ${loc.city}. Let's talk.`} cta="Get a Free Strategy Call" />
    </>
  );
}
