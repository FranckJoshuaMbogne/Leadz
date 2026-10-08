import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { HeroField } from "@/components/art/HeroField";
import { site } from "@/config/site";

/** Closing conversion section. Copy is contextual per page. */
export function CtaBand({
  eyebrow = "Next step",
  title = "Let's build your growth system.",
  body = "Book a 30-minute strategy call. We'll look at where growth is being lost today and what a connected system would change — whether or not we end up working together.",
  cta = "Book a Strategy Call",
  to = "/book",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  cta?: string;
  to?: string;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-forest text-ivory">
      <HeroField className="pointer-events-none absolute -right-1/4 top-1/2 -z-10 h-[140%] w-[110%] -translate-y-1/2 opacity-40 md:-right-[10%] md:w-[80%]" />
      <div className="container-site py-section">
        <div className="max-w-4xl">
          <Reveal>
            <Eyebrow light>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-7 font-display text-display-xl">{title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-lead text-ivory/75">{body}</p>
          </Reveal>
          <Reveal delay={0.18} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <ButtonLink to={to} variant="light" size="lg">
              {cta}
            </ButtonLink>
            <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="group/btn inline-flex min-h-[44px] items-center gap-2 text-ivory/80 hover:text-ivory">
              <span className="link-underline">Or message us on WhatsApp</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
