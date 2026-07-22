import { useParams, Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { useSEO } from "@/hooks/useSEO";
import { services } from "@/data/services";
import { ServiceSection } from "@/components/ui/ServiceSection";
import { motion } from "framer-motion";

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
            {service.timeline && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="rounded-pill bg-white/[0.04] px-3 py-1 text-sm font-semibold text-ink">Timeline: {service.timeline}</span>
                {service.price && (
                  <span className="rounded-pill bg-white/[0.04] px-3 py-1 text-sm font-semibold text-ink">{service.price}</span>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {service.lottieUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-card bg-transparent flex items-center justify-center">
                  <lottie-player
                    src={service.lottieUrl}
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              ) : service.videoUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-card bg-black">
                  <iframe
                    className="h-full w-full"
                    src={service.videoUrl}
                    title={`${service.title} explainer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}

              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold text-ink">What we deliver</h3>
                <p className="text-sm text-silver">{service.solution}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <ServiceSection service={service} index={0} />

              {service.process && (
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-ink">Process</h4>
                  <ol className="mt-3 space-y-3 list-decimal pl-5 text-sm text-silver">
                    {service.process.map((p, i) => (
                      <li key={i}>
                        <motion.div whileHover={{ x: 6 }} className="leading-relaxed">
                          {p}
                        </motion.div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default ServiceLanding;
