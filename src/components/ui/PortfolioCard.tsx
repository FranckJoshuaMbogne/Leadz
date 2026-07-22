import { motion } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import type { CaseStudy } from "@/data/portfolio";
import { GlassCard } from "./GlassCard";
import { Button } from "./Button";

export function PortfolioCard({ study }: { study: CaseStudy }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      id={study.slug}
      className="scroll-mt-24"
    >
      <GlassCard hoverLift={false} className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="rounded-pill bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-electric">
            {study.industry}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-display font-bold text-ink">{study.title}</h3>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-silver">Challenge</p>
            <p className="mt-1 text-sm leading-relaxed text-silver">{study.challenge}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-silver">Solution</p>
            <p className="mt-1 text-sm leading-relaxed text-silver">{study.solutionSummary}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 rounded-card bg-white/[0.03] p-4">
          {study.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="font-display text-lg font-bold text-ink">{m.value}</p>
              <p className="mt-1 text-[10px] leading-tight text-silver">{m.label}</p>
            </div>
          ))}
        </div>

        <ul className="mt-5 space-y-2">
          {study.results.map((r) => (
            <li key={r} className="flex gap-2 text-sm text-silver">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric" />
              {r}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {study.technologies.map((t) => (
            <span key={t} className="rounded-pill border border-white/[0.08] px-2.5 py-1 text-[11px] text-silver">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 border-t border-white/[0.08] pt-5">
          <Quote size={16} className="text-electric" />
          <p className="mt-2 text-sm italic leading-relaxed text-silver">"{study.quote}"</p>
          <p className="mt-3 text-xs font-semibold text-ink">
            {study.clientName} <span className="font-normal text-silver">· {study.clientRole}</span>
          </p>
        </div>

        <div className="mt-6">
          <Button variant="secondary" className="w-full">
            Get Results Like This <ArrowUpRight size={16} />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
