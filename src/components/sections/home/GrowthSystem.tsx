import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { growthStages, type GrowthStage } from "@/data/growthSystem";
import { getPillar } from "@/data/services";
import { GrowthWheel } from "@/components/art/GrowthWheel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function StagePanel({ stage, i, onActive, active }: { stage: GrowthStage; i: number; onActive: (i: number) => void; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);
  const pillar = getPillar(stage.pillar);

  return (
    <div ref={ref} className="relative pb-16 pl-10 lg:flex lg:min-h-[78vh] lg:flex-col lg:justify-center lg:pb-0 lg:pl-0">
      {/* mobile timeline node */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1 flex h-[22px] w-[22px] -translate-x-1/2 items-center justify-center rounded-full border text-[9px] font-semibold transition-colors duration-300 lg:hidden",
          active ? "border-gold bg-gold text-deep" : "border-ivory/30 bg-deep text-ivory/70"
        )}
      >
        {stage.index}
      </span>
      <motion.div
        initial={{ opacity: 0.35 }}
        animate={{ opacity: active ? 1 : 0.5 }}
        transition={{ duration: 0.5 }}
        className="lg:max-w-xl"
      >
        <p className="eyebrow text-gold-light">
          {stage.index} — {stage.verb}
        </p>
        <h3 className="mt-4 font-display text-display-lg italic">{stage.name}</h3>
        <p className="mt-6 text-lead text-ivory/75">{stage.description}</p>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${stage.name} capabilities`}>
          {stage.capabilities.map((c) => (
            <li key={c} className="rounded-sm border border-ivory/20 px-3 py-1.5 text-sm text-ivory/85">
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-5 border-t border-ivory/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg italic text-ivory/70">“{stage.question}”</p>
          {pillar && (
            <Link to={`/services/${pillar.slug}`} className="group/btn inline-flex shrink-0 items-center gap-3 text-sm text-ivory hover:text-gold-light">
              <span className="link-underline">{pillar.name}</span> <Arrow />
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function GrowthSystem() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="growth-system" aria-labelledby="system-title" className="on-dark relative bg-deep text-ivory">
      <div className="container-site pt-section">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow light index="03">The Springs 360 Growth System</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="system-title" className="mt-6 font-display text-display-xl">
                Five stages. <em className="italic">One loop.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-lead text-ivory/75">
              Every engagement is designed around the full customer journey. Each stage has a job, an owner and a number —
              and each one makes the next stronger.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container-site pb-section pt-16 lg:pt-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[12vh] flex h-[76vh] items-center">
              <GrowthWheel active={active} progress={progress} className="max-h-full" />
            </div>
          </div>

          <div ref={listRef} className="relative lg:col-span-6">
            {/* mobile progress line */}
            <div aria-hidden="true" className="absolute bottom-16 left-0 top-2 w-px bg-ivory/15 lg:hidden">
              <motion.div className="h-full w-full origin-top bg-gold" style={{ scaleY: progress }} />
            </div>
            <ol aria-label="Growth system stages">
              {growthStages.map((s, i) => (
                <li key={s.name}>
                  <StagePanel stage={s} i={i} onActive={setActive} active={active === i} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
