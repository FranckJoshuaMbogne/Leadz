import { useMemo } from "react";
import { seededRandom } from "@/lib/utils";

/**
 * The hero visual: many scattered streams (channels, touchpoints, data)
 * flowing in from the left and converging into one 360° ring — the growth
 * system. Dashed strokes drift along the streams like particles of attention.
 * Pure SVG + CSS: no JS animation loop, fully static under reduced motion.
 */

const W = 1200;
const H = 900;
const CX = 840;
const CY = 450;
const R = 230;
const STAGES = ["Attract", "Capture", "Nurture", "Convert", "Retain"];

export function HeroField({ className }: { className?: string }) {
  const streams = useMemo(() => {
    const rand = seededRandom(360);
    const out: { d: string; opacity: number; width: number; dash?: string; gold?: boolean; dur: number }[] = [];
    const n = 38;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const y0 = -60 + t * (H + 120) + (rand() - 0.5) * 30;
      const theta = Math.PI * (0.62 + t * 0.76); // 112° → 248°, the left half of the ring
      const px = CX + R * Math.cos(theta);
      const py = CY + R * Math.sin(theta);
      const c1x = 220 + rand() * 160;
      const c2x = px - 240 - rand() * 80;
      const c2y = py + (py - CY) * 0.35;
      // continue along the ring clockwise for a short arc
      const sweep = 0.35 + rand() * 0.5;
      const theta2 = theta + sweep;
      const ex = CX + R * Math.cos(theta2);
      const ey = CY + R * Math.sin(theta2);
      const d = `M-40,${y0.toFixed(1)} C${c1x.toFixed(1)},${y0.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)} A${R},${R} 0 0 1 ${ex.toFixed(1)},${ey.toFixed(1)}`;
      const gold = i === 9 || i === 27;
      out.push({
        d,
        opacity: gold ? 0.85 : 0.12 + rand() * 0.3,
        width: gold ? 1.3 : 0.9,
        dash: i % 3 === 0 || gold ? `${2 + Math.floor(rand() * 3)} ${18 + Math.floor(rand() * 30)}` : undefined,
        gold,
        dur: 26 + rand() * 30,
      });
    }
    return out;
  }, []);

  const ticks = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        const a = (i / 72) * Math.PI * 2;
        const long = i % 6 === 0;
        const r1 = R + 70;
        const r2 = r1 + (long ? 14 : 6);
        return { x1: CX + r1 * Math.cos(a), y1: CY + r1 * Math.sin(a), x2: CX + r2 * Math.cos(a), y2: CY + r2 * Math.sin(a), long };
      }),
    []
  );

  const labels = STAGES.map((s, i) => {
    const a = -Math.PI / 2 + (i / STAGES.length) * Math.PI * 2;
    const r = R + 118;
    return { s, x: CX + r * Math.cos(a), y: CY + r * Math.sin(a), n: i + 1 };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="hf-glow" cx={CX / W} cy={CY / H} r="0.42">
          <stop offset="0%" stopColor="#2C6A4F" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#123B2A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0A2118" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#hf-glow)" />

      <g className="anim-drift">
        {streams.map((s, i) => (
          <path
            key={i}
            d={s.d}
            fill="none"
            stroke={s.gold ? "#B89B62" : "#F5F1E8"}
            strokeOpacity={s.opacity}
            strokeWidth={s.width}
            strokeDasharray={s.dash}
            strokeLinecap="round"
            className={s.dash ? "anim-flow" : undefined}
            style={s.dash ? { animationDuration: `${s.dur}s` } : undefined}
          />
        ))}
      </g>

      {/* The ring */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F5F1E8" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={R - 46} fill="none" stroke="#F5F1E8" strokeOpacity="0.12" />
      <circle cx={CX} cy={CY} r={R - 120} fill="none" stroke="#F5F1E8" strokeOpacity="0.08" />
      <g className="anim-spin-slow">
        <circle cx={CX} cy={CY} r={R + 36} fill="none" stroke="#B89B62" strokeOpacity="0.5" strokeDasharray="1 9" />
        <circle cx={CX + R + 36} cy={CY} r="3.5" fill="#B89B62" />
      </g>
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#F5F1E8" strokeOpacity={t.long ? 0.45 : 0.18} />
      ))}
      {labels.map((l) => {
        const a = -Math.PI / 2 + ((l.n - 1) / 5) * Math.PI * 2;
        return <circle key={l.s} cx={CX + R * Math.cos(a)} cy={CY + R * Math.sin(a)} r="3.5" fill="#F5F1E8" fillOpacity="0.8" />;
      })}
    </svg>
  );
}
