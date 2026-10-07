import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Subtle vertical parallax for imagery. Turned off for reduced motion. */
export function Parallax({ children, className, strength = 40 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={reduce ? undefined : { y, scale: 1.08 }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
