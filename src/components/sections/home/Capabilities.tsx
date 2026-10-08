import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { pillars } from "@/data/services";
import { CoverArt } from "@/components/art/CoverArt";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

export function Capabilities() {
  const [active, setActive] = useState(0);
  const p = pillars[active];

  return (
    <section aria-labelledby="capabilities-title" className="bg-ivory py-section">
      <div className="container-site">
        <SectionHeader
          index="04"
          eyebrow="Capabilities"
          title={<span id="capabilities-title">Five disciplines, <em className="italic">one team.</em></span>}
          intro="Every capability is organised around a stage of growth. Bring us in for one — or let us connect all five."
        />

        {/* Desktop: interactive index + preview */}
        <div className="mt-20 hidden gap-16 lg:grid lg:grid-cols-12">
          <ul className="border-t border-ink/15 lg:col-span-6">
            {pillars.map((pl, i) => (
              <li key={pl.slug} className="border-b border-ink/15">
                <Link
                  to={`/services/${pl.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group/btn flex items-center gap-8 py-7"
                  aria-describedby={`pillar-sum-${pl.slug}`}
                >
                  <span className={cn("w-8 text-sm tabular-nums transition-colors", active === i ? "text-gold-dark" : "text-ink-soft")}>{pl.index}</span>
                  <span
                    className={cn(
                      "flex-1 font-display text-display-md transition-[color,transform] duration-300 ease-editorial",
                      active === i ? "translate-x-2 text-ink" : "text-ink/45"
                    )}
                  >
                    {pl.name}
                  </span>
                  <span className={cn("transition-opacity", active === i ? "opacity-100" : "opacity-0")}>
                    <Arrow />
                  </span>
                  <span id={`pillar-sum-${pl.slug}`} className="sr-only">{pl.summary}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="lg:col-span-6">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="aspect-[16/10] overflow-hidden rounded">
                    <motion.div initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="h-full w-full">
                      <CoverArt seed={p.slug} variant={p.art} tone="forest" />
                    </motion.div>
                  </div>
                  <p className="mt-8 text-lead text-ink">{p.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem] text-ink-muted">
                    {p.services.map((s) => (
                      <li key={s.name} className="flex items-center gap-2">
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: editorial stack */}
        <ul className="mt-14 space-y-14 lg:hidden">
          {pillars.map((pl) => (
            <Reveal as="li" key={pl.slug}>
              <Link to={`/services/${pl.slug}`} className="group/btn block">
                <div className="aspect-[16/9] overflow-hidden rounded">
                  <CoverArt seed={pl.slug} variant={pl.art} tone="forest" />
                </div>
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="text-sm tabular-nums text-gold-dark">{pl.index}</span>
                  <h3 className="font-display text-display-md text-ink">{pl.name}</h3>
                </div>
              </Link>
              <p className="mt-4 text-ink-muted">{pl.summary}</p>
              <p className="mt-4 text-sm text-ink-soft">{pl.services.map((s) => s.name).join(" · ")}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-16 flex justify-start lg:mt-20">
          <ButtonLink to="/services" variant="primary" size="lg">
            Find Your Growth Opportunity
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
