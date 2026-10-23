import { motion, type MotionValue, useReducedMotion } from "framer-motion";
import { useContent } from "@/content/ContentProvider";
import { cn } from "@/lib/utils";

const S = 520;
const C = S / 2;
const R = 190;
const FONT = "Plus Jakarta Sans Variable, Plus Jakarta Sans, sans-serif";

function polar(i: number, n: number, r = R) {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

/**
 * The growth wheel: four steps around a 360° ring. The gold arc draws with
 * scroll progress and the active step is highlighted.
 */
export function GrowthWheel({ active, progress, className, compact = false }: { active: number; progress?: MotionValue<number>; className?: string; compact?: boolean }) {
  const reduce = useReducedMotion();
  const growthStages = useContent().growth;
  const N = growthStages.length || 1;
  return (
    <svg
      viewBox={compact ? `20 20 ${S - 40} ${S - 40}` : `-150 -30 ${S + 300} ${S + 60}`}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label={`The Springs 360 growth wheel: ${growthStages.map((g) => g.name).join(", ")} — connected in a continuous loop.`}
    >
      <circle cx={C} cy={C} r={R + 54} fill="none" stroke="#F5F1E8" strokeOpacity="0.08" />
      <circle cx={C} cy={C} r={R} fill="none" stroke="#F5F1E8" strokeOpacity="0.18" />
      <circle cx={C} cy={C} r={R - 70} fill="none" stroke="#F5F1E8" strokeOpacity="0.08" strokeDasharray="2 8" />
      {progress && !reduce ? (
        <motion.circle cx={C} cy={C} r={R} fill="none" stroke="#B89B62" strokeWidth="3" strokeLinecap="round" transform={`rotate(-90 ${C} ${C})`} style={{ pathLength: progress }} />
      ) : (
        <circle cx={C} cy={C} r={R} fill="none" stroke="#B89B62" strokeWidth="3" strokeOpacity="0.6" />
      )}

      {growthStages.map((_, i) => {
        const p = polar(i, N, R - 70);
        const q = polar(i, N, R);
        return <line key={`s${i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#F5F1E8" strokeOpacity={i === active ? 0.5 : 0.1} />;
      })}

      {growthStages.map((s, i) => {
        const p = polar(i, N);
        const l = polar(i, N, R + 58);
        const on = i === active;
        const anchor = i === 1 ? "start" : i === 3 ? "end" : "middle";
        const dy = i === 0 ? -8 : i === 2 ? 16 : 5;
        return (
          <g key={s.key}>
            <circle cx={p.x} cy={p.y} r={compact ? (on ? 34 : 26) : on ? 26 : 19} fill={on ? "#B89B62" : "#0A2118"} stroke={on ? "#B89B62" : "#F5F1E8"} strokeOpacity={on ? 1 : 0.35} style={{ transition: "all 400ms cubic-bezier(.22,1,.36,1)" }} />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fontSize={compact ? 22 : 14} fontFamily={FONT} fill={on ? "#0A2118" : "#F5F1E8"} fillOpacity={on ? 1 : 0.75} fontWeight={700}>
              {i + 1}
            </text>
            {!compact && <text x={l.x} y={l.y + dy} textAnchor={anchor} dominantBaseline="middle" fontSize="19" fontWeight={700} fontFamily={FONT} fill="#F5F1E8" fillOpacity={on ? 1 : 0.45} style={{ transition: "fill-opacity 400ms" }}>
              {s.name}
            </text>}
          </g>
        );
      })}

      <text x={C} y={C - 6} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize="64" fill="#F5F1E8" letterSpacing="-2">
        360°
      </text>
      <text x={C} y={C + 32} textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight={600} letterSpacing="4" fill="#F5F1E8" fillOpacity="0.55">
        GROWTH WHEEL
      </text>
    </svg>
  );
}
