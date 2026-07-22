import { Star } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <GlassCard className="h-full">
      <div className="flex gap-1 text-electric">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-silver">"{quote}"</p>
      <div className="mt-6">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="text-xs text-silver">{role}</p>
      </div>
    </GlassCard>
  );
}
