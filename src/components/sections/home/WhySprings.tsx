import { Reveal } from "@/components/animations/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

const parts = [
  {
    name: "Strategy",
    text: "We start with the economics and the customer — so every channel has a job and every rupee has a reason.",
  },
  {
    name: "Execution",
    text: "The same team that plans also builds and runs the campaigns, pages and automations. Nothing is lost in hand-offs.",
  },
  {
    name: "Technology",
    text: "CRM, automation and AI are designed into the system from the start, not bolted on after the leads go cold.",
  },
  {
    name: "Data",
    text: "One model of performance, from spend to revenue, reviewed on a fixed rhythm and used to decide what happens next.",
  },
];

export function WhySprings() {
  return (
    <section aria-labelledby="why-title" className="bg-ivory py-section">
      <div className="container-site">
        <SectionHeader
          index="06"
          eyebrow="Why Springs 360"
          title={<span id="why-title">Most agencies do one of these. <em className="italic">Growth needs all four.</em></span>}
        />
        <ol className="mt-16 grid border-t border-ink/15 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {parts.map((p, i) => (
            <Reveal
              as="li"
              key={p.name}
              delay={i * 0.08}
              className="relative border-b border-ink/15 py-10 sm:px-8 sm:first:pl-0 sm:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:border-r lg:[&:nth-child(odd)]:pl-8 lg:first:!pl-0 lg:last:border-r-0"
            >
              <p aria-hidden="true" className="text-sm tabular-nums text-ink-soft">0{i + 1}</p>
              <h3 className="mt-6 font-display text-display-md text-ink">
                {i > 0 && <span aria-hidden="true" className="mr-3 font-sans font-light text-gold">+</span>}
                {p.name}
              </h3>
              <p className="mt-4 text-ink-muted">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
