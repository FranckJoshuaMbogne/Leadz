import { useMemo, type ReactElement } from "react";
import { cn, hashString, seededRandom } from "@/lib/utils";

/**
 * Generative editorial artwork.
 *
 * Abstract, deterministic compositions (same seed → same picture on server
 * and client) used where the site would otherwise need stock imagery. They
 * represent systems, flow and data without implying real client imagery.
 * Replace with art-directed photography when it exists.
 */

export type ArtVariant = "contour" | "flow" | "rings" | "grid" | "orbit";
export type ArtTone = "forest" | "sage" | "ivory" | "deep";

const tones: Record<ArtTone, { bg: string; line: string; soft: string; accent: string }> = {
  deep: { bg: "#0A2118", line: "#F5F1E8", soft: "#2C6A4F", accent: "#B89B62" },
  forest: { bg: "#123B2A", line: "#F5F1E8", soft: "#2C6A4F", accent: "#D2BC8E" },
  sage: { bg: "#DCE7DE", line: "#123B2A", soft: "#A3BBA9", accent: "#715A2F" },
  ivory: { bg: "#ECE6D8", line: "#123B2A", soft: "#BFD1C3", accent: "#B89B62" },
};

const variants: ArtVariant[] = ["contour", "flow", "rings", "grid", "orbit"];

const W = 800;
const H = 600;

function blobPath(cx: number, cy: number, r: number, rand: () => number, k: number, phase: number[]) {
  const pts: string[] = [];
  const steps = 72;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    let rr = r;
    for (let j = 0; j < k; j++) rr += r * 0.09 * Math.sin((j + 2) * t + phase[j]) / (j + 1);
    pts.push(`${(cx + rr * Math.cos(t)).toFixed(1)},${(cy + rr * Math.sin(t) * 0.82).toFixed(1)}`);
  }
  void rand;
  return `M${pts.join("L")}Z`;
}

function useArt(seed: string, variant: ArtVariant | undefined, tone: ArtTone) {
  return useMemo(() => {
    const h = hashString(seed);
    const rand = seededRandom(h);
    const v = variant ?? variants[h % variants.length];
    const c = tones[tone];
    const els: ReactElement[] = [];

    if (v === "contour") {
      const cx = W * (0.45 + rand() * 0.25);
      const cy = H * (0.4 + rand() * 0.2);
      const phase = Array.from({ length: 4 }, () => rand() * Math.PI * 2);
      for (let i = 0; i < 16; i++) {
        const r = 40 + i * 32;
        els.push(
          <path
            key={`c${i}`}
            d={blobPath(cx, cy, r, rand, 4, phase.map((p) => p + i * 0.07))}
            fill="none"
            stroke={i === 5 ? c.accent : c.line}
            strokeOpacity={i === 5 ? 0.9 : 0.12 + (i % 3) * 0.06}
            strokeWidth={i === 5 ? 1.4 : 1}
          />
        );
      }
      els.push(<circle key="dot" cx={cx} cy={cy} r={4} fill={c.accent} />);
    }

    if (v === "flow") {
      const amp = 40 + rand() * 50;
      const freq = 0.004 + rand() * 0.004;
      const ph = rand() * Math.PI * 2;
      for (let i = 0; i < 26; i++) {
        const y0 = -40 + i * 26;
        const pts: string[] = [];
        for (let x = -20; x <= W + 20; x += 20) {
          const y = y0 + Math.sin(x * freq + ph + i * 0.12) * amp * (0.4 + (x / W) * 0.9);
          pts.push(`${x},${y.toFixed(1)}`);
        }
        const accent = i === 13;
        els.push(
          <polyline
            key={`f${i}`}
            points={pts.join(" ")}
            fill="none"
            stroke={accent ? c.accent : c.line}
            strokeOpacity={accent ? 0.95 : 0.1 + (i % 4) * 0.05}
            strokeWidth={accent ? 1.5 : 1}
          />
        );
      }
    }

    if (v === "rings") {
      const cx = W * (0.3 + rand() * 0.4);
      const cy = H * 0.5;
      for (let i = 0; i < 12; i++) {
        const r = 24 + i * i * 4.2;
        els.push(<circle key={`r${i}`} cx={cx} cy={cy} r={r} fill="none" stroke={c.line} strokeOpacity={0.1 + (i % 2) * 0.1} />);
      }
      const r = 24 + 7 * 7 * 4.2;
      const a0 = rand() * Math.PI * 2;
      const a1 = a0 + 1.1 + rand();
      els.push(
        <path
          key="arc"
          d={`M${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}`}
          fill="none"
          stroke={c.accent}
          strokeWidth={2}
        />
      );
      els.push(<circle key="rd" cx={cx + r * Math.cos(a1)} cy={cy + r * Math.sin(a1)} r={5} fill={c.accent} />);
      els.push(<line key="ax" x1={0} x2={W} y1={cy} y2={cy} stroke={c.line} strokeOpacity={0.15} />);
    }

    if (v === "grid") {
      const cols = 20;
      const rows = 15;
      const pts: [number, number][] = [];
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const px = 40 + (x * (W - 80)) / (cols - 1);
          const py = 40 + (y * (H - 80)) / (rows - 1);
          const lit = rand() > 0.94;
          els.push(<circle key={`g${x}-${y}`} cx={px} cy={py} r={lit ? 3 : 1.4} fill={lit ? c.accent : c.line} fillOpacity={lit ? 1 : 0.28} />);
          if (lit) pts.push([px, py]);
        }
      }
      pts.sort((a, b) => a[0] - b[0]);
      if (pts.length > 1)
        els.push(
          <polyline key="gl" points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={c.accent} strokeOpacity={0.7} strokeWidth={1.2} />
        );
      // rising trend
      const trend: string[] = [];
      for (let x = 0; x <= W; x += 40) trend.push(`${x},${(H * 0.85 - (x / W) ** 1.6 * H * 0.6 + Math.sin(x * 0.03) * 12).toFixed(1)}`);
      els.push(<polyline key="tr" points={trend.join(" ")} fill="none" stroke={c.line} strokeOpacity={0.55} strokeWidth={1.4} />);
    }

    if (v === "orbit") {
      const cx = W * 0.5;
      const cy = H * 0.5;
      const tilt = -20 + rand() * 40;
      for (let i = 0; i < 9; i++) {
        els.push(
          <ellipse
            key={`o${i}`}
            cx={cx}
            cy={cy}
            rx={80 + i * 42}
            ry={30 + i * 16}
            fill="none"
            stroke={c.line}
            strokeOpacity={0.12 + (i % 3) * 0.05}
            transform={`rotate(${tilt + i * 3} ${cx} ${cy})`}
          />
        );
      }
      for (let i = 0; i < 5; i++) {
        const t = rand() * Math.PI * 2;
        const k = 2 + Math.floor(rand() * 6);
        const rx = 80 + k * 42;
        const ry = 30 + k * 16;
        const ang = ((tilt + k * 3) * Math.PI) / 180;
        const x = rx * Math.cos(t);
        const y = ry * Math.sin(t);
        els.push(
          <circle
            key={`p${i}`}
            cx={cx + x * Math.cos(ang) - y * Math.sin(ang)}
            cy={cy + x * Math.sin(ang) + y * Math.cos(ang)}
            r={i === 0 ? 6 : 3}
            fill={i === 0 ? c.accent : c.line}
            fillOpacity={i === 0 ? 1 : 0.7}
          />
        );
      }
      els.push(<circle key="core" cx={cx} cy={cy} r={22} fill={c.soft} fillOpacity={0.6} />);
    }

    return { els, c };
  }, [seed, variant, tone]);
}

export function CoverArt({
  seed,
  variant,
  tone = "forest",
  className,
  label,
}: {
  seed: string;
  variant?: ArtVariant;
  tone?: ArtTone;
  className?: string;
  /** Accessible description; omit for purely decorative use. */
  label?: string;
}) {
  const { els, c } = useArt(seed, variant, tone);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <rect width={W} height={H} fill={c.bg} />
      {els}
    </svg>
  );
}
