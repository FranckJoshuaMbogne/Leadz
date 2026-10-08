import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";

const statement = "Marketing doesn't operate in channels. Your customer experiences one business.";

function Word({ word, progress, range, accent, still }: { word: string; progress: MotionValue<number>; range: [number, number]; accent: boolean; still: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={still ? undefined : { opacity }} className={accent ? "italic text-forest-600" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

export function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = statement.split(" ");
  const accentFrom = words.indexOf("Your");

  return (
    <section aria-labelledby="statement-title" className="bg-ivory py-section">
      <div className="container-site">
        <Reveal>
          <Eyebrow index="01">Our point of view</Eyebrow>
        </Reveal>
        <div ref={ref}>
          <h2 id="statement-title" className="mt-10 max-w-6xl font-display text-display-xl text-ink">
            {words.map((w, i) => (
              <Word key={i} word={w} still={!!reduce} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2) / words.length)]} accent={i >= accentFrom} />
            ))}
          </h2>
        </div>
        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-6">
            <p className="text-lead text-ink-muted">
              A prospect sees an ad, reads a page, sends a WhatsApp message, waits for a reply and decides. To them it is
              one experience. Inside most businesses, it is five vendors, four dashboards and nobody accountable for the whole.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5 md:col-start-6">
            <p className="text-lead text-ink-muted">
              Springs 360 connects the journey — strategy, acquisition, conversion, nurturing, retention and measurement —
              so every investment strengthens the next.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
