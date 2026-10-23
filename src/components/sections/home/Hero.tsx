import { Check } from "lucide-react";
import { MaskText } from "@/components/animations/MaskText";
import { ButtonA } from "@/components/ui/Button";
import { CtaLink, GoldText } from "@/components/ui/CtaLink";
import { MediaImage } from "@/components/ui/MediaImage";
import { HeroCollage } from "@/components/sections/HeroCollage";
import { useContact, useContent } from "@/content/ContentProvider";

export function Hero() {
  const contact = useContact();
  const { settings: s } = useContent();
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-deep text-ivory">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_35%,rgba(44,106,79,0.55),transparent_60%)]"
      />
      <div className="container-site grid items-center gap-12 pb-16 pt-28 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-8 lg:pb-16 lg:pt-32">
        <div className="lg:col-span-7">
          <p className="anim-fade-up eyebrow flex items-center gap-3 text-ivory/75" style={{ animationDelay: "0.05s" }}>
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            {s.heroEyebrow}
          </p>
          <h1 id="hero-title" className="mt-6 font-display font-extrabold leading-[1.02] tracking-[-0.035em]" style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}>
            <MaskText
              lines={s.heroLines.map((l, i) => <GoldText key={i} text={l} />)}
              delay={0.1}
              step={0.12}
            />
          </h1>
          <p className="anim-fade-up mt-7 font-accent text-[clamp(1.4rem,2.6vw,2.1rem)] italic leading-snug text-ivory" style={{ animationDelay: "0.4s" }}>
            {s.heroSubtitle}
          </p>
          <p className="anim-fade-up mt-4 max-w-xl text-lead text-ivory/75" style={{ animationDelay: "0.5s" }}>
            {s.heroText}
          </p>
          <div className="anim-fade-up mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center" style={{ animationDelay: "0.6s" }}>
            <CtaLink href={s.ctaHref || "/book"} variant="light" size="lg">
              {s.ctaLabel}
            </CtaLink>
            <ButtonA href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" variant="outline-light" size="lg" arrow={false}>
              Chat on WhatsApp
            </ButtonA>
          </div>
          <ul className="anim-fade-up mt-8 flex flex-col gap-2 text-sm text-ivory/75 sm:flex-row sm:flex-wrap sm:gap-x-6" style={{ animationDelay: "0.7s" }}>
            {s.reassurance.map((r) => (
              <li key={r} className="flex items-center gap-2">
                <Check size={16} className="text-gold-light" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          {s.heroImage ? <MediaImage src={s.heroImage} eager className="aspect-[4/5] w-full rounded-2xl object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]" /> : <HeroCollage />}
        </div>
      </div>
    </section>
  );
}
