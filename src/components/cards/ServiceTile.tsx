import { Link } from "react-router-dom";
import type { CatalogItem } from "@/data/catalog";
import { Arrow } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { iconFor } from "@/lib/icons";

/** Plain, scannable service card: icon, the service name customers use, one-line outcome. */
export function ServiceTile({ item, compact = false, dark = false }: { item: CatalogItem; compact?: boolean; dark?: boolean }) {
  const Icon = iconFor(item.icon);
  return (
    <Link
      to={`/services/${item.slug}`}
      className={cn(
        "group/btn flex h-full flex-col rounded-lg border p-4 transition-[border-color,background-color,transform] duration-200 ease-editorial hover:-translate-y-0.5 sm:p-6",
        dark ? "border-ivory/15 bg-ivory/[0.03] hover:border-ivory/35 hover:bg-ivory/[0.06]" : "border-ink/10 bg-ivory-50 hover:border-forest/40 hover:bg-white"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11",
          dark ? "bg-ivory/10 text-gold-light" : "bg-sage-100 text-forest"
        )}
      >
        <Icon size={20} strokeWidth={1.7} />
      </span>
      <span className={cn("mt-4 font-display text-[0.98rem] leading-snug sm:mt-5 sm:text-[1.08rem]", dark ? "text-ivory" : "text-ink")}>{item.label}</span>
      {!compact && <span className={cn("mt-2 hidden flex-1 text-[0.94rem] leading-relaxed sm:block", dark ? "text-ivory/70" : "text-ink-muted")}>{item.outcome}</span>}
      <span className={cn("mt-auto hidden items-center gap-2 pt-5 text-sm font-medium sm:inline-flex", dark ? "text-gold-light" : "text-forest")}>
        Learn more <Arrow className="h-3 w-4" />
      </span>
    </Link>
  );
}
