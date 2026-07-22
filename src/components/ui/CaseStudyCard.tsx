import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface CaseStudyCardProps {
  industry: string;
  result: string;
  metric: string;
  slug: string;
}

export function CaseStudyCard({ industry, result, metric, slug }: CaseStudyCardProps) {
  return (
    <Link to={`/portfolio#${slug}`}>
      <GlassCard className="group flex h-full flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-electric">
            {industry}
          </p>
          <p className="mt-4 font-display text-3xl font-bold text-ink">{metric}</p>
          <p className="mt-2 text-sm text-silver">{result}</p>
        </div>
        <div className="mt-6 flex items-center gap-1 text-sm font-medium text-silver group-hover:text-ink">
          View case study
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>
      </GlassCard>
    </Link>
  );
}
