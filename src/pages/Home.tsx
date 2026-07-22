import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCounter } from "@/components/ui/StatCounter";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { useSEO } from "@/hooks/useSEO";
import {
  trustLogos,
  differentiators,
  problems,
  processSteps,
  servicesPreview,
  aiAdvantage,
  caseStudiesPreview,
  testimonials,
  industries,
  numbers,
  faqs,
} from "@/data/home";

export function Home() {
  useSEO(
    "Nexus Growth — AI-Powered Lead Generation Agency",
    "We turn ad spend into booked calls. AI, automation, and paid media combined into one predictable revenue system."
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-brand opacity-20 blur-[120px]" />
        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-block rounded-pill glass px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric">
              AI-Powered Growth Partner
            </span>
            <h1 className="mt-6 text-display-xl font-display font-bold text-ink">
              We turn ad spend into <GradientText>booked calls.</GradientText>
            </h1>
            <p className="mt-6 text-lg text-silver md:text-xl">
              Nexus Growth combines AI, automation, and paid media into one system that
              finds, qualifies, and books your next customer — on autopilot.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg">
                Book a Free Strategy Call <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="secondary">
                See Case Studies
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-silver">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-electric" /> No long-term lock-in</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-electric" /> Leads within 2–3 weeks</span>
              <span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-electric" /> Full ROI transparency</span>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Social Proof */}
      <section className="border-y border-white/[0.06] py-10">
        <Container>
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-silver">
            Trusted by businesses across dental, legal, real estate & hospitality
          </p>
          <LogoMarquee items={trustLogos} />
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="section-y">
        <Container>
          <SectionHeading
            eyebrow="Why Nexus Growth"
            title="Built to be measured, not just admired"
            subtitle="Every system we build reports back to one number: cost per booked call."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d) => (
              <GlassCard key={d.title} className="h-full">
                <h3 className="text-base font-semibold text-ink">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{d.description}</p>
              </GlassCard>
            ))}
          </div>
        </Container>
      </section>

      {/* Problems We Solve */}
      <section className="section-y bg-elevated">
        <Container>
          <SectionHeading
            eyebrow="The Problem"
            title="Most growth problems aren't a marketing problem"
            subtitle="They're a systems problem. Here's what we fix."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {problems.map((p) => (
              <GlassCard key={p.problem} className="h-full">
                <p className="text-base font-semibold text-ink">{p.problem}</p>
                <p className="mt-3 text-sm leading-relaxed text-silver">{p.agitate}</p>
                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <p className="text-sm font-medium text-gradient">{p.solution}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Process */}
      <section className="section-y">
        <Container>
          <SectionHeading
            eyebrow="Our Process"
            title="From audit to booked calls in four steps"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <ProcessStep key={step.title} index={i} {...step} />
            ))}
          </div>
        </Container>
      </section>

      {/* Services Preview */}
      <section className="section-y bg-elevated">
        <Container>
          <SectionHeading
            eyebrow="What We Do"
            title="One system, every growth lever"
            subtitle="Each service below plugs into the same pipeline and reporting stack."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicesPreview.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="secondary" size="lg">
              View All Services <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>

      {/* AI Advantage */}
      <section className="section-y">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="The AI Advantage"
                title="AI does the work that used to fall through the cracks"
                align="left"
              />
              <div className="mt-10 space-y-6">
                {aiAdvantage.map((item) => (
                  <div key={item.title} className="border-l-2 border-electric pl-5">
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-silver">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <GlassCard className="flex h-full min-h-[320px] items-center justify-center">
              <p className="text-center text-sm text-silver">
                [ Live qualification / response-time visual — added in polish pass ]
              </p>
            </GlassCard>
          </div>
        </Container>
      </section>

      {/* Case Studies Preview */}
      <section className="section-y bg-elevated">
        <Container>
          <SectionHeading eyebrow="Results" title="Real businesses, real pipeline" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {caseStudiesPreview.map((c) => (
              <CaseStudyCard key={c.slug} {...c} />
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="section-y">
        <Container>
          <SectionHeading eyebrow="Testimonials" title="What clients say after 90 days" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </Container>
      </section>

      {/* Industries We Serve */}
      <section className="section-y bg-elevated">
        <Container>
          <SectionHeading eyebrow="Industries" title="Built for businesses that live on booked appointments" />
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            {industries.map((ind) => (
              <span
                key={ind}
                className="glass rounded-pill px-5 py-2.5 text-sm font-medium text-silver"
              >
                {ind}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Numbers */}
      <section className="section-y">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {numbers.map((n) => (
              <StatCounter key={n.label} {...n} />
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-y bg-elevated">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions we get asked before signing" />
          <div className="mt-12">
            <FAQAccordion items={faqs} />
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="section-y">
        <Container>
          <div className="relative overflow-hidden rounded-card bg-gradient-brand px-8 py-16 text-center md:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-display-lg font-display font-bold text-white">
                Ready for a pipeline you can actually predict?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">
                Book a free 30-minute strategy call. We'll show you exactly where your
                next 90 days of leads are coming from.
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
