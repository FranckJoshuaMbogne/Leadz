import { ButtonA, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/animations/Reveal";
import { useContact } from "@/content/ContentProvider";

/** Closing conversion section. Copy is contextual per page. */
export function CtaBand({
  eyebrow = "Next step",
  title = "Ready for more customers? Let's talk.",
  body = "Book a free 30-minute strategy call. We'll look at your marketing, show you where sales are slipping away, and tell you exactly what we'd do first. No obligation.",
  cta = "Get a Free Strategy Call",
  to = "/book",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  cta?: string;
  to?: string;
}) {
  const contact = useContact();
  return (
    <section className="on-dark relative isolate overflow-hidden bg-forest text-ivory">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_20%,rgba(184,155,98,0.18),transparent_55%)]" />
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
          <Reveal delay={0.18} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink to={to} variant="light" size="lg">
              {cta}
            </ButtonLink>
            <ButtonA href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" variant="outline-light" size="lg" arrow={false}>
              Chat on WhatsApp
            </ButtonA>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
