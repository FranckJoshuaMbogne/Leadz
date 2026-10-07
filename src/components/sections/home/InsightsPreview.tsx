import { useInsights } from "@/lib/insights";
import { InsightCard } from "@/components/cards/InsightCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function InsightsPreview() {
  const { insights } = useInsights();
  const featured = insights.find((i) => i.featured) ?? insights[0];
  const rest = insights.filter((i) => i.slug !== featured?.slug).slice(0, 3);
  if (!featured) return null;

  return (
    <section aria-labelledby="insights-title" className="bg-ivory py-section">
      <div className="container-site">
        <SectionHeader
          index="08"
          eyebrow="Insights"
          title={<span id="insights-title">Thinking on growth, <em className="italic">in practice.</em></span>}
          intro="Practical writing on acquisition, conversion, automation and measurement — the decisions growing businesses actually face."
        />
        <Reveal className="mt-16 md:mt-20">
          <InsightCard insight={featured} featured />
        </Reveal>
        <div className="mt-16 grid gap-12 border-t border-ink/15 pt-12 md:grid-cols-3 md:gap-8">
          {rest.map((ins, i) => (
            <Reveal key={ins.slug} delay={i * 0.08}>
              <InsightCard insight={ins} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14 flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-8">
          <ButtonLink to="/insights" variant="outline">
            All insights
          </ButtonLink>
          <ButtonLink to="/book" variant="text">
            Talk to a Growth Strategist
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
