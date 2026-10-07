import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Tag({ children, light = false, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-medium tracking-wide",
        light ? "border-ivory/25 text-ivory/80" : "border-ink/20 text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Marks content that is illustrative rather than a verified client result. */
export function IllustrativeBadge({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.14em]",
        light ? "bg-ivory/10 text-gold-light" : "bg-gold/15 text-gold-dark",
        className
      )}
      title="Illustrative scenario — not a verified client result"
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      Illustrative
    </span>
  );
}
