import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";
import { caseStudies, industryFilters } from "@/data/portfolio";

export function Portfolio() {
  useSEO(
    "Portfolio — Leadz.in",
    "Real case studies across dental, legal, real estate, hospitality, clinics, and SaaS — with the metrics behind every result."
  );

  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return caseStudies.filter((s) => {
      const matchesFilter = activeFilter === "All" || s.industry === activeFilter;
      const matchesQuery =
        query.trim() === "" ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.industry.toLowerCase().includes(query.toLowerCase()) ||
        s.technologies.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-brand opacity-15 blur-[120px]" />
        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-block rounded-pill glass px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric">
              Portfolio
            </span>
            <h1 className="mt-6 text-display-lg font-display font-bold text-ink">
              Real businesses. <GradientText>Real pipeline.</GradientText>
            </h1>
            <p className="mt-5 text-lg text-silver">
              Every result below is tied to a system still running today. Filter by
              industry or search by service to see what's possible for your business.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Filter + Search */}
      <section className="sticky top-16 z-30 border-y border-white/[0.06] bg-base/80 py-4 backdrop-blur-lg md:top-20">
        <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {industryFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "rounded-pill px-3.5 py-1.5 text-xs font-medium transition-colors",
                  activeFilter === f
                    ? "bg-gradient-brand text-white"
                    : "glass text-silver hover:text-ink"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search case studies..."
              className="w-full rounded-pill glass py-2 pl-9 pr-4 text-sm text-ink placeholder:text-silver/60 focus:outline-none"
            />
          </div>
        </Container>
      </section>

      {/* Results Grid */}
      <section className="section-y">
        <Container>
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-silver">
              No case studies match that search. Try a different industry or keyword.
            </p>
          ) : (
            <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((study) => (
                  <PortfolioCard key={study.slug} study={study} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Final CTA */}
      <section className="section-y bg-elevated">
        <Container>
          <div className="relative overflow-hidden rounded-card bg-gradient-brand px-8 py-16 text-center md:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-display-lg font-display font-bold text-white">
                Ready to be the next case study?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">
                Book a free strategy call and we'll show you exactly how this would work
                for your business.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-white text-base font-semibold text-navy shadow-none hover:brightness-95"
                >
                  Book a Free Strategy Call <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
