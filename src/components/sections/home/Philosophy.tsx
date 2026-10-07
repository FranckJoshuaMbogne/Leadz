import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export const principles = [
  { title: "Systems over campaigns", text: "Campaigns end. Systems compound. We build things that keep working after launch." },
  { title: "Evidence over opinion", text: "We agree the numbers first, then let them decide where effort and budget go." },
  { title: "Clarity over complexity", text: "Every tool, workflow and report has to earn its place — and be understood by your team." },
  { title: "Honesty over hype", text: "We say what we can measure, what we cannot, and what we would do in your position." },
];

export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="bg-sage py-section">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow index="09">How we work</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <blockquote className="mt-8">
              <p id="philosophy-title" className="font-display text-display-lg text-ink">
                Strategy without execution is a document. Execution without strategy is <em className="italic">noise.</em>
              </p>
            </blockquote>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <ButtonLink to="/about" variant="primary">
              About Springs 360
            </ButtonLink>
          </Reveal>
        </div>
        <ol className="grid gap-px self-end overflow-hidden rounded border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:col-span-6">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="bg-sage-100 p-7 sm:p-8">
              <p className="text-sm tabular-nums text-gold-dark">0{i + 1}</p>
              <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-ink-muted">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
