import { motion, type MotionValue, useReducedMotion } from "framer-motion";
import { growthStages } from "@/data/growthSystem";
import { cn } from "@/lib/utils";

const S = 520;
const C = S / 2;
const R = 190;

function polar(i: number, r = R) {
  const a = -Math.PI / 2 + (i / growthStages.length) * Math.PI * 2;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

/**
 * The signature diagram: five stages around a 360° ring. The gold arc draws
 * with scroll progress and the active stage is emphasised.
 */
export function GrowthWheel({ active, progress, className }: { active: number; progress?: MotionValue<number>; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox={`-130 -20 ${S + 260} ${S + 40}`} className={cn("h-auto w-full", className)} role="img" aria-label="The Springs 360 Growth System: Attract, Capture, Nurture, Convert, Retain — connected in a continuous loop.">
      <circle cx={C} cy={C} r={R + 54} fill="none" stroke="#F5F1E8" strokeOpacity="0.08" />
      <circle cx={C} cy={C} r={R} fill="none" stroke="#F5F1E8" strokeOpacity="0.18" />
      <circle cx={C} cy={C} r={R - 70} fill="none" stroke="#F5F1E8" strokeOpacity="0.08" strokeDasharray="2 8" />
      {progress && !reduce ? (
        <motion.circle
          cx={C}
          cy={C}
          r={R}
          fill="none"
          stroke="#B89B62"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(-90 ${C} ${C})`}
          style={{ pathLength: progress }}
        />
      ) : (
        <circle cx={C} cy={C} r={R} fill="none" stroke="#B89B62" strokeWidth="2" strokeOpacity="0.6" />
      )}

      {/* spokes */}
      {growthStages.map((_, i) => {
        const p = polar(i, R - 70);
        const q = polar(i, R);
        return <line key={`s${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#F5F1E8" strokeOpacity={i === active ? 0.5 : 0.1} />;
      })}

      {growthStages.map((s, i) => {
        const p = polar(i);
        const l = polar(i, R + 54);
        const on = i === active;
        return (
          <g key={s.name}>
            <circle cx={p.x} cy={p.y} r={on ? 22 : 16} fill={on ? "#B89B62" : "#0A2118"} stroke={on ? "#B89B62" : "#F5F1E8"} strokeOpacity={on ? 1 : 0.35} style={{ transition: "all 400ms cubic-bezier(.22,1,.36,1)" }} />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize="11" fontFamily="DM Sans Variable, DM Sans, sans-serif" fill={on ? "#0A2118" : "#F5F1E8"} fillOpacity={on ? 1 : 0.7} fontWeight={600}>
              {s.index}
            </text>
            <text
              x={l.x}
              y={l.y + (i === 0 ? -6 : i === 2 || i === 3 ? 12 : 0)}
              textAnchor={l.x < C - 20 ? "end" : l.x > C + 20 ? "start" : "middle"}
              dominantBaseline="middle"
              fontSize="14"
              letterSpacing="3"
              fontFamily="DM Sans Variable, DM Sans, sans-serif"
              fill="#F5F1E8"
              fillOpacity={on ? 1 : 0.45}
              style={{ transition: "fill-opacity 400ms" }}
            >
              {s.name.toUpperCase()}
            </text>
          </g>
        );
      })}

      <text x={C} y={C - 8} textAnchor="middle" fontFamily="Bodoni Moda Variable, Bodoni Moda, serif" fontSize="64" fill="#F5F1E8" fontStyle="italic">
        360
      </text>
      <text x={C} y={C + 32} textAnchor="middle" fontFamily="DM Sans Variable, DM Sans, sans-serif" fontSize="11" letterSpacing="4" fill="#F5F1E8" fillOpacity="0.55">
        GROWTH SYSTEM
      </text>
    </svg>
  );
}
