import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";

const steps = [
  { title: "Free strategy call", text: "30 minutes on your business, your goals and what's holding sales back. No obligation." },
  { title: "Your 360° plan & quote", text: "A clear plan of what we'll do, which channels we'll use, and a transparent quote." },
  { title: "We launch & manage", text: "Content, ads, website, follow-up — set up and run by one team, so you can focus on your business." },
  { title: "Monthly report & growth", text: "Simple monthly reports in plain language, and ongoing improvements to what's working." },
];

export function HowItWorks({ title = "How we work together", light = false }: { title?: string; light?: boolean }) {
  return (
    <section aria-labelledby="how-title" className={light ? "bg-ivory py-section" : "on-dark bg-deep py-section text-ivory"}>
      <div className="container-site">
        <SectionHeader
          light={!light}
          eyebrow="How it works"
          title={<span id="how-title">{title}</span>}
          intro="Getting started is simple. You talk to a strategist, not a salesperson."
        />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 0.06}
              className={light ? "rounded-lg border border-ink/10 bg-ivory-50 p-6" : "rounded-lg border border-ivory/15 bg-ivory/[0.03] p-6"}
            >
              <span className={light ? "flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-semibold text-ivory" : "flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-semibold text-deep"}>
                {i + 1}
              </span>
              <h3 className={light ? "mt-6 font-display text-xl text-ink" : "mt-6 font-display text-xl"}>{s.title}</h3>
              <p className={light ? "mt-2 text-ink-muted" : "mt-2 text-ivory/70"}>{s.text}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-12">
          <ButtonLink to="/book" variant={light ? "primary" : "light"} size="lg">
            Get a Free Strategy Call
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
