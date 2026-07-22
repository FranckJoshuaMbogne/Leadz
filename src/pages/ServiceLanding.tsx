import { useParams, Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { useSEO } from "@/hooks/useSEO";
import { services } from "@/data/services";
import { ServiceSection } from "@/components/ui/ServiceSection";

export function ServiceLanding() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    useSEO("Service not found — Leadz.in", "");
    return (
      <Container className="py-40 text-center">
        <h2 className="text-display-md font-display font-bold text-ink">Service not found</h2>
        <p className="mt-4 text-silver">We couldn't find that service. Try browsing our services list.</p>
        <div className="mt-6">
          <Link to="/services" className="text-electric underline">
            All Services
          </Link>
        </div>
      </Container>
    );
  }

  useSEO(`${service.title} — Leadz.in`, service.tagline);

  return (
    <main>
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-6 text-display-lg font-display font-bold text-ink">{service.title}</h1>
            <p className="mt-4 text-lg text-silver">{service.tagline}</p>
          </div>
        </Container>
      </section>

      <ServiceSection service={service} index={0} />
    </main>
  );
}

export default ServiceLanding;
