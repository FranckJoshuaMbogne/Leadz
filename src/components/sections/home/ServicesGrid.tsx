import { useSite } from "@/content/useSite";
import { ServiceTile } from "@/components/cards/ServiceTile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function ServicesGrid() {
  const { topServices } = useSite();
  return (
    <section aria-labelledby="services-title" className="bg-ivory py-section">
      <div className="container-site">
        <SectionHeader
          eyebrow="What we do"
          title={<span id="services-title">Everything your brand needs. <em>One team.</em></span>}
          intro="Pick one service or let us run the full 360°. Either way, everything works together — and you get one point of contact."
        />
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {topServices.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 4) * 0.05}>
              <ServiceTile item={s} />
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12 flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-8">
          <ButtonLink to="/book" variant="primary" size="lg">
            Get a Free Strategy Call
          </ButtonLink>
          <ButtonLink to="/services" variant="text">
            See all services
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
