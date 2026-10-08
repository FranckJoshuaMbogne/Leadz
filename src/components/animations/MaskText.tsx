import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

/**
 * Line-by-line masked reveal driven by CSS so it runs before hydration
 * (good for LCP on prerendered pages). Disabled by the global reduced-motion rule.
 */
export function MaskText({
  lines,
  className,
  lineClassName,
  delay = 0,
  step = 0.12,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  step?: number;
}) {
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
          <span
            className={cn("mask-line block", lineClassName)}
            style={{ animationDelay: `${delay + i * step}s` } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
