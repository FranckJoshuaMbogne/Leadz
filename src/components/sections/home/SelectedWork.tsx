import { sortedCaseStudies, hasVerifiedWork } from "@/data/caseStudies";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function SelectedWork() {
  const [first, second, third] = sortedCaseStudies;
  return (
    <section aria-labelledby="work-title" className="bg-sage-100 py-section">
      <div className="container-site">
        <SectionHeader
          index="05"
          eyebrow="Selected work"
          title={<span id="work-title">What a connected system <em className="italic">looks like.</em></span>}
          intro={
            hasVerifiedWork
              ? "A selection of engagements across acquisition, conversion, automation and data."
              : "Illustrative scenarios showing how we approach common growth problems — the challenge, the system we design and the measures we are accountable for."
          }
        />
        <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-20 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <CaseStudyCard study={first} size="lg" />
          </Reveal>
          <div className="grid gap-16 md:col-span-5 md:pt-24">
            <Reveal delay={0.08}>
              <CaseStudyCard study={second} />
            </Reveal>
            <Reveal delay={0.12}>
              <CaseStudyCard study={third} />
            </Reveal>
          </div>
        </div>
        <Reveal className="mt-16 flex flex-col gap-6 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          {!hasVerifiedWork && (
            <p className="max-w-xl text-sm text-ink-soft">
              Scenarios marked “Illustrative” are representative examples, not results from named clients.
            </p>
          )}
          <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-8">
            <ButtonLink to="/book" variant="primary">
              Build Something Similar
            </ButtonLink>
            <ButtonLink to="/work" variant="text">
              All work
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
