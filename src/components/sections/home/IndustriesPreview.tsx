import { Link } from "react-router-dom";
import { industries } from "@/data/industries";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function IndustriesPreview() {
  return (
    <section aria-labelledby="industries-title" className="bg-ivory-200 py-section">
      <div className="container-site">
        <SectionHeader
          index="07"
          eyebrow="Industries"
          title={<span id="industries-title">Built for businesses where <em className="italic">every customer counts.</em></span>}
          intro="The system is the same; the problems differ. We adapt channels, messaging and compliance to the way your market buys."
        />
        <ul className="mt-16 grid border-t border-ink/15 md:grid-cols-2 md:gap-x-12">
          {industries.map((ind, i) => (
            <Reveal as="li" key={ind.slug} delay={(i % 2) * 0.06} className="border-b border-ink/15">
              <Link to={`/industries/${ind.slug}`} className="group/btn flex items-center gap-6 py-6">
                <span className="flex-1">
                  <span className="block font-display text-[1.6rem] leading-tight text-ink transition-transform duration-300 ease-editorial group-hover/btn:translate-x-1.5">
                    {ind.name}
                  </span>
                  <span className="mt-1.5 block text-[0.95rem] text-ink-muted">{ind.summary}</span>
                </span>
                <Arrow className="text-ink/50 group-hover/btn:text-ink" />
              </Link>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12">
          <ButtonLink to="/industries" variant="outline">
            Explore industries
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
