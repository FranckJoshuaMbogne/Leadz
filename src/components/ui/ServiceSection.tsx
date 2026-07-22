import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "./Container";
import { Button } from "./Button";
import { GlassCard } from "./GlassCard";
import type { ServiceDetail } from "@/data/services";

export function ServiceSection({ service, index }: { service: ServiceDetail; index: number }) {
  const Icon = service.icon;
  const reversed = index % 2 === 1;

  return (
    <section
      id={service.slug}
      className={`scroll-mt-24 section-y ${index % 2 === 1 ? "bg-elevated" : ""}`}
    >
      <Container>
        <div className={`grid items-start gap-12 lg:grid-cols-2 ${reversed ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-brand">
              <Icon size={20} className="text-white" />
            </div>
            <h2 className="mt-5 text-display-md font-display font-bold text-ink">
              {service.title}
            </h2>
            <p className="mt-2 text-lg text-silver">{service.tagline}</p>

            <div className="mt-8 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-electric">The Problem</p>
                <p className="mt-1 text-sm leading-relaxed text-silver">{service.problem}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-electric">Our Solution</p>
                <p className="mt-1 text-sm leading-relaxed text-silver">{service.solution}</p>
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg">
                Book a Free Strategy Call <ArrowRight size={16} />
              </Button>
              <div className="mt-3">
                <Link to={`/services/${service.slug}`} className="text-sm text-electric underline">
                  Learn more about {service.title}
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <GlassCard>
              <p className="text-sm font-semibold text-ink">What you get</p>
              <ul className="mt-4 space-y-3">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-silver">
                    <Check size={16} className="mt-0.5 shrink-0 text-electric" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-white/[0.08] pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-silver">Expected Results</p>
                <p className="mt-1 text-sm text-ink">{service.results}</p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-silver">Ideal Client</p>
                <p className="mt-1 text-sm text-ink">{service.idealClient}</p>
              </div>

              <div className="mt-5 rounded-card bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-silver">Investment</p>
                <p className="mt-1 text-sm text-ink">{service.pricingNote}</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
