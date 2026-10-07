import { HeroField } from "@/components/art/HeroField";
import { MaskText } from "@/components/animations/MaskText";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

const disciplines = ["Strategy", "Marketing", "Technology", "AI", "Data"];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-deep text-ivory">
      <div aria-hidden="true" className="anim-fade-in absolute inset-0 -z-10" style={{ animationDuration: "2.4s" }}>
        <HeroField className="absolute right-[-55%] top-[-6%] h-[78%] w-[190%] opacity-60 sm:right-[-30%] sm:w-[140%] md:right-[-8%] md:top-0 md:h-full md:w-[95%] md:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent md:bg-gradient-to-r md:from-deep md:via-deep/60 md:to-transparent" />
      </div>

      <div className="container-site flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14">
        <div className="anim-fade-up" style={{ animationDelay: "0.05s" }}>
          <Eyebrow light>A 360° growth agency</Eyebrow>
        </div>
        <h1 id="hero-title" className="mt-7 font-display text-display-2xl">
          <MaskText lines={["We build", <em key="g" className="font-normal italic text-ivory">growth systems.</em>]} delay={0.12} step={0.14} />
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <p className="anim-fade-up max-w-xl text-lead text-ivory/80 md:col-span-6" style={{ animationDelay: "0.45s" }}>
            Strategy, marketing, technology and AI — connected to help ambitious businesses attract, convert and retain customers.
          </p>
          <div className="anim-fade-up flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-8 md:col-span-6 md:justify-end" style={{ animationDelay: "0.55s" }}>
            <ButtonLink to="/book" variant="light" size="lg">
              Start a Conversation
            </ButtonLink>
            <ButtonLink to="/work" variant="text-light">
              Explore Our Work
            </ButtonLink>
          </div>
        </div>

        <div className="anim-fade-in mt-14 flex items-center justify-between border-t border-ivory/15 pt-6 text-sm text-ivory/60" style={{ animationDelay: "0.8s" }}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Disciplines">
            {disciplines.map((d, i) => (
              <li key={d} className="flex items-center gap-5">
                {d}
                {i < disciplines.length - 1 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />}
              </li>
            ))}
          </ul>
          <span className="hidden items-center gap-3 md:flex" aria-hidden="true">
            Scroll
            <span className="relative h-8 w-px overflow-hidden bg-ivory/20">
              <span className="anim-scroll-cue absolute inset-x-0 top-0 h-3 bg-gold" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
