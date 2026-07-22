import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { ServiceSection } from "@/components/ui/ServiceSection";
import { ServiceJumpNav } from "@/components/ui/ServiceJumpNav";
import { useSEO } from "@/hooks/useSEO";
import { services } from "@/data/services";

export function Services() {
  useSEO(
    "Services — Leadz.in",
    "Lead generation, Google Ads, Meta Ads, local SEO, CRO, CRM automation, AI chatbots, and more — one connected growth system."
  );

  return (
    <>
      {/* Page Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-brand opacity-15 blur-[120px]" />
        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-block rounded-pill glass px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric">
              Services
            </span>
            <h1 className="mt-6 text-display-lg font-display font-bold text-ink">
              One growth system, <GradientText>every lever included.</GradientText>
            </h1>
            <p className="mt-5 text-lg text-silver">
              Thirteen services. One connected system. Jump to any service below, or book a
              call and we'll design the right mix for your business.
            </p>
            <div className="mt-8">
              <Link to="/contact">
                <Button size="lg">
                  Book a Free Strategy Call <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      <ServiceJumpNav services={services} />

      {services.map((service, i) => (
        <ServiceSection key={service.slug} service={service} index={i} />
      ))}

      {/* Final CTA */}
      <section className="section-y">
        <Container>
          <div className="relative overflow-hidden rounded-card bg-gradient-brand px-8 py-16 text-center md:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-display-lg font-display font-bold text-white">
                Not sure which services you need?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">
                Book a free strategy call and we'll map the right combination for your
                business, your budget, and your growth targets.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-white text-base font-semibold text-navy shadow-none hover:brightness-95"
                >
                  Book a Free Strategy Call <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
