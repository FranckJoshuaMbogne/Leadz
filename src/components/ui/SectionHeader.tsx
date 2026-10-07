import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "@/components/animations/Reveal";

export function SectionHeader({
  eyebrow,
  index,
  title,
  intro,
  light = false,
  align = "split",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  light?: boolean;
  align?: "split" | "stack";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        align === "split" ? "grid gap-8 lg:grid-cols-12 lg:items-end" : "max-w-4xl",
        className
      )}
    >
      <div className={cn(align === "split" && "lg:col-span-7")}>
        {eyebrow && (
          <Reveal>
            <Eyebrow light={light} index={index}>
              {eyebrow}
            </Eyebrow>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <Heading className={cn("mt-6 font-display text-display-lg", light ? "text-ivory" : "text-ink")}>{title}</Heading>
        </Reveal>
      </div>
      {intro && (
        <Reveal delay={0.12} className={cn(align === "split" ? "lg:col-span-5 lg:pb-2" : "mt-6")}>
          <div className={cn("max-w-xl text-lead", light ? "text-ivory/75" : "text-ink-muted")}>{intro}</div>
        </Reveal>
      )}
    </div>
  );
}
