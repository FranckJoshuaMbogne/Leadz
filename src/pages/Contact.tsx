import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageCircle, CalendarCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GradientText } from "@/components/ui/GradientText";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/ui/ContactForm";
import { Newsletter } from "@/components/ui/Newsletter";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { useSEO } from "@/hooks/useSEO";
import { socialLinks, businessHours, contactFaqs } from "@/data/contact";

export function Contact() {
  useSEO(
    "Contact — Leadz.in",
    "Book a free strategy call or send us a message. We typically respond within one business day."
  );

  return (
    <>
      {/* Hero */}
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
              Contact
            </span>
            <h1 className="mt-6 text-display-lg font-display font-bold text-ink">
              Let's build your <GradientText>growth system.</GradientText>
            </h1>
            <p className="mt-5 text-lg text-silver">
              Send a message, book a call directly, or reach us on WhatsApp — we typically
              respond within one business day.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Form + Info */}
      <section className="pb-section-sm md:pb-section">
        <Container>
          <div className="grid gap-8 lg:grid-cols-5">
            <GlassCard hoverLift={false} className="lg:col-span-3">
              <h2 className="text-lg font-semibold text-ink">Send us a message</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </GlassCard>

            <div className="space-y-6 lg:col-span-2">
              <GlassCard hoverLift={false}>
                <Button size="lg" className="w-full">
                  <CalendarCheck size={18} /> Book a Call on Calendly
                </Button>
                <a
                  href="https://wa.me/918522997932"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill glass py-3.5 text-sm font-semibold text-ink hover:bg-white/[0.08]"
                >
                  <MessageCircle size={18} className="text-[#25D366]" /> Chat on WhatsApp
                </a>
              </GlassCard>

              <GlassCard hoverLift={false}>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail size={16} className="mt-0.5 shrink-0 text-electric" />
                    <a href="mailto:hello@leadz.in" className="text-silver hover:text-ink">
                      hello@leadz.in
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone size={16} className="mt-0.5 shrink-0 text-electric" />
                    <a href="tel:+918522997932" className="text-silver hover:text-ink">
                      +91 85229 97932
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-electric" />
                    <span className="text-silver">Remote-first, serving clients globally</span>
                  </li>
                </ul>

                <div className="mt-5 flex gap-3 border-t border-white/[0.08] pt-5">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-silver hover:text-ink"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </GlassCard>

              <GlassCard hoverLift={false}>
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Clock size={16} className="text-electric" /> Business Hours
                </p>
                <ul className="mt-3 space-y-2">
                  {businessHours.map((h) => (
                    <li key={h.day} className="flex justify-between text-sm text-silver">
                      <span>{h.day}</span>
                      <span>{h.hours}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-xl bg-white/[0.03] p-3 text-xs text-silver">
                  Urgent? Message us on WhatsApp — we monitor it outside business hours for
                  time-sensitive inquiries.
                </p>
              </GlassCard>
            </div>
          </div>
        </Container>
      </section>

      {/* Map Placeholder */}
      <section className="pb-section-sm md:pb-section">
        <Container>
          <div className="flex h-64 items-center justify-center rounded-card glass md:h-80">
            <p className="flex items-center gap-2 text-sm text-silver">
              <MapPin size={16} /> Google Maps embed placeholder
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section-y bg-elevated">
        <Container className="max-w-3xl">
          <h2 className="text-center text-display-md font-display font-bold text-ink">
            Questions before you reach out?
          </h2>
          <div className="mt-10">
            <FAQAccordion items={contactFaqs} />
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="section-y">
        <Container className="max-w-xl text-center">
          <h2 className="text-display-md font-display font-bold text-ink">
            Get growth tips in your inbox
          </h2>
          <p className="mt-3 text-silver">
            One email a month. No fluff — just what's working in paid acquisition right now.
          </p>
          <div className="mt-6">
            <Newsletter />
          </div>
        </Container>
      </section>
    </>
  );
}
