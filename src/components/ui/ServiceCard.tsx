import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  anchor: string;
}

export function ServiceCard({ icon: Icon, title, description, anchor }: ServiceCardProps) {
  return (
    <Link to={`/services#${anchor}`}>
      <GlassCard className="group h-full">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06]">
            <Icon size={20} className="text-electric" />
          </div>
          <ArrowUpRight
            size={18}
            className="text-silver transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink"
          />
        </div>
        <h3 className="mt-5 text-base font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-silver">{description}</p>
      </GlassCard>
    </Link>
  );
}
