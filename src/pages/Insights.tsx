import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Seo, breadcrumbLd } from "@/lib/seo";
import { useInsights } from "@/lib/insights";
import { insightCategories } from "@/data/insights";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { InsightCard } from "@/components/cards/InsightCard";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

export default function Insights() {
  const { insights } = useInsights({ live: true });
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "All";
  const q = params.get("q") ?? "";

  const available = useMemo(() => {
    const present = new Set(insights.map((i) => i.category));
    return ["All", ...insightCategories.filter((c) => present.has(c)), ...Array.from(present).filter((c) => !(insightCategories as readonly string[]).includes(c))];
  }, [insights]);

  const featured = insights.find((i) => i.featured) ?? insights[0];
  const filtering = category !== "All" || q.trim() !== "";
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return insights.filter(
      (i) =>
        (category === "All" || i.category === category) &&
        (!term || `${i.title} ${i.excerpt} ${i.category}`.toLowerCase().includes(term)) &&
        (filtering || i.slug !== featured?.slug)
    );
  }, [insights, category, q, filtering, featured]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "All") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <Seo
        title="Insights — Growth, Marketing, AI & Data"
        description="Practical articles on customer acquisition, conversion, marketing automation, AI and measurement from the Springs 360 team."
        path="/insights"
        jsonLd={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Insights"
        titleLines={["Notes on building", <em key="g" className="italic">growth that lasts.</em>]}
        intro="Clear, practical thinking on acquisition, conversion, automation and measurement — written for the people making the decisions."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ]}
        art={{ seed: "insights-hero", variant: "grid" }}
      />

      <section className="bg-ivory py-section-sm">
        <div className="container-site">
          {featured && !filtering && (
            <Reveal className="border-b border-ink/15 pb-16">
              <p className="eyebrow mb-8 text-ink-muted">Featured</p>
              <InsightCard insight={featured} featured headingLevel={2} />
            </Reveal>
          )}

          <div className={cn("flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between", !filtering && "mt-14")}>
            <div role="group" aria-label="Filter by category" className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
              {available.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => update("category", c)}
                  className={cn(
                    "min-h-[42px] shrink-0 rounded-sm border px-4 text-sm transition-colors",
                    category === c ? "border-forest bg-forest text-ivory" : "border-ink/20 text-ink-muted hover:border-ink hover:text-ink"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative lg:w-80">
              <label htmlFor="insight-search" className="sr-only">
                Search insights
              </label>
              <input
                id="insight-search"
                type="search"
                value={q}
                onChange={(e) => update("q", e.target.value)}
                placeholder="Search articles"
                className="h-12 w-full rounded-sm border border-ink/20 bg-ivory-50 px-4 text-ink placeholder:text-ink-soft focus:border-forest focus:outline-none focus-visible:outline-2"
              />
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {list.length} {list.length === 1 ? "article" : "articles"} found
          </p>

          {list.length ? (
            <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((i, idx) => (
                <Reveal key={i.slug} delay={(idx % 3) * 0.06}>
                  <InsightCard insight={i} headingLevel={2} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-16 rounded border border-ink/15 p-10 text-center">
              <p className="font-display text-2xl text-ink">No articles match that search yet.</p>
              <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-4 text-ink underline decoration-gold underline-offset-4">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <CtaBand eyebrow="Put it into practice" title="Talk to a growth strategist." cta="Talk to a Growth Strategist" />
    </>
  );
}
