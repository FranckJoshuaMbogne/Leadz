import { motion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "span" | "figure";
}

/**
 * Fades and lifts content into view once. Under prefers-reduced-motion the
 * global <MotionConfig reducedMotion="user"> removes the movement and keeps
 * a simple fade.
 */
export function Reveal({ children, delay = 0, y = 28, as = "div", ...rest }: RevealProps) {
  const Comp = motion[as] as ElementType;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Staggers direct <Reveal> children. */
export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode[]; className?: string; gap?: number }) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * gap}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
