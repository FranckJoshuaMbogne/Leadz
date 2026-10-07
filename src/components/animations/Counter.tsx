import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Counts up the numeric part of a metric ("+240%", "<1 min", "212") when it
 * scrolls into view. The final value is rendered on the server so crawlers
 * and no-JS visitors always see it.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(value);
  const armed = useRef(false);

  useEffect(() => {
    if (!match || reduce || inView) return;
    // Only reset to zero for counters still below the fold.
    armed.current = true;
    setDisplay(`${match[1]}0${match[3]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!match || !inView || !armed.current) return;
    const target = parseFloat(match[2]);
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${match[1]}${v.toFixed(decimals)}${match[3]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">
        <MetricText value={display} />
      </span>
    </span>
  );
}

/**
 * Renders a metric with any leading sign (+, -, <, ~) set in the sans face —
 * display-serif signs are too light at large sizes.
 */
export function MetricText({ value }: { value: string }) {
  const m = value.match(/^([+\-<>~−]+)(.*)$/);
  if (!m) return <>{value}</>;
  return (
    <>
      <span className="mr-[0.04em] font-sans font-light">{m[1].replace("-", "−")}</span>
      {m[2]}
    </>
  );
}
