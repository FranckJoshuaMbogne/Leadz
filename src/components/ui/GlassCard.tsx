import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  className?: string;
  hoverLift?: boolean;
}

export function GlassCard({
  children,
  className,
  hoverLift = true,
}: PropsWithChildren<GlassCardProps>) {
  return (
    <motion.div
      whileHover={hoverLift ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "glass rounded-card p-6 md:p-8 transition-shadow duration-300 hover:shadow-glow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
