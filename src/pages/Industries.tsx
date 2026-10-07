import { Link } from "react-router-dom";
import { Seo, breadcrumbLd } from "@/lib/seo";
import { industries } from "@/data/industries";
import { getService } from "@/data/services";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { CoverArt } from "@/components/art/CoverArt";
import { Reveal } from "@/components/animations/Reveal";
import { Arrow } from "@/components/ui/Button";

export default function Industries() {
  return (
    <>
      <Seo
        title="Industries — Growth Systems by Sector"
        description="How Springs 360 adapts its growth system to fashion and luxury, retail, hospitality, real estate, healthcare, professional and financial services, technology, ecommerce and local businesses."
        path="/industries"
        jsonLd={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])]}
      />
      <PageHero
        eyebrow="Industries"
        titleLines={["Same system.", <em key="d" className="italic">Different problems.</em>]}
        intro="Every market buys differently. We start with the specific problem your sector faces, then apply the parts of the growth system that solve it."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ]}
        art={{ seed: "industries-hero", variant: "rings" }}
      />

      <section className="bg-ivory py-section-sm">
        <div className="container-site">
          <div className="hidden grid-cols-12 gap-8 border-b border-ink/15 pb-4 text-xs uppercase tracking-[0.16em] text-ink-soft md:grid">
            <span className="col-span-3">Industry</span>
            <span className="col-span-4">Business problem</span>
            <span className="col-span-4">Relevant capabilities</span>
          </div>
          <ul>
            {industries.map((ind) => (
              <Reveal as="li" key={ind.slug} className="border-b border-ink/15">
                <Link to={`/industries/${ind.slug}`} className="group/btn grid gap-6 py-10 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-3">
                    <div className="mb-5 aspect-[3/2] overflow-hidden rounded md:hidden">
                      <CoverArt seed={ind.slug} variant={ind.art} tone="sage" />
                    </div>
                    <h2 className="font-display text-display-sm text-ink transition-transform duration-300 ease-editorial group-hover/btn:translate-x-1.5">{ind.name}</h2>
                    <p className="mt-2 text-ink-muted">{ind.summary}</p>
                  </div>
                  <ul className="space-y-2 text-ink md:col-span-4">
                    {ind.problems.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-gold" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start justify-between gap-6 md:col-span-5">
                    <p className="text-ink-muted">
                      {ind.capabilities
                        .map((c) => getService(c)?.name)
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <Arrow className="mt-2 text-ink/40 group-hover/btn:text-ink" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-sm text-ink-soft">
            Don't see your sector? The growth system applies wherever customers move from awareness to purchase. Tell us about your
            market on a strategy call.
          </p>
        </div>
      </section>

      <CtaBand eyebrow="Your market" title="Talk to a growth strategist." cta="Talk to a Growth Strategist" />
    </>
  );
}
