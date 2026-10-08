import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Small uppercase label with a gold rule — the system's section marker. */
export function Eyebrow({ children, className, light = false, index }: { children: ReactNode; className?: string; light?: boolean; index?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", light ? "text-ivory/75" : "text-ink-muted", className)}>
      {index && <span className={cn("tabular-nums", light ? "text-gold-light" : "text-gold-dark")}>{index}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-gold" />
      <span>{children}</span>
    </p>
  );
}
