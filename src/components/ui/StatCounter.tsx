import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

export function StatCounter({ value, suffix = "", prefix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <p ref={ref} className="text-display-md font-display font-bold tabular-nums text-ink">
        {prefix}
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-silver">{label}</p>
    </motion.div>
  );
}
