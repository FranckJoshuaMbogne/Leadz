import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

const fragmented = [
  { who: "Ads agency", reports: "Clicks and cost per lead" },
  { who: "Web developer", reports: "A launched website" },
  { who: "Social freelancer", reports: "Followers and reach" },
  { who: "Sales team", reports: "Deals in a spreadsheet" },
  { who: "Analytics", reports: "Owned by nobody" },
];

const connected = [
  "One strategy that gives every channel a defined job",
  "One customer journey, designed end to end",
  "One CRM as the source of truth for every lead",
  "One set of numbers, from spend to revenue",
  "One team accountable for the outcome",
];

function Scatter() {
  const pts = [
    [30, 40], [120, 22], [200, 70], [70, 120], [170, 140],
  ];
  return (
    <svg viewBox="0 0 240 170" className="h-auto w-40" aria-hidden="true">
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="none" stroke="#20332B" strokeOpacity="0.5" />
          <line x1={x + 9} y1={y} x2={x + 26} y2={y} stroke="#20332B" strokeOpacity="0.25" strokeDasharray="2 4" />
        </g>
      ))}
    </svg>
  );
}

function Loop() {
  return (
    <svg viewBox="0 0 240 170" className="h-auto w-40" aria-hidden="true">
      <circle cx="120" cy="85" r="62" fill="none" stroke="#F5F1E8" strokeOpacity="0.5" />
      <path d="M120 23 A62 62 0 1 1 61 66" fill="none" stroke="#B89B62" strokeWidth="1.6" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
        return <circle key={i} cx={120 + 62 * Math.cos(a)} cy={85 + 62 * Math.sin(a)} r="5" fill="#F5F1E8" />;
      })}
    </svg>
  );
}

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="bg-ivory pb-section">
      <div className="container-site">
        <div className="grid gap-8 border-t border-ink/15 pt-section-sm lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow index="02">The problem</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="problem-title" className="mt-6 font-display text-display-lg text-ink">
                Fragmented marketing creates <em className="italic">fragmented growth.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <p className="text-lead text-ink-muted">
              When every vendor optimises their own metric, the business optimises nothing. Leads are bought but not followed
              up. Sites launch but are never improved. Reports disagree. Growth becomes a matter of luck.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-6">
          <Reveal className="rounded border border-ink/15 bg-ivory-50 p-7 sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow text-ink-muted">The usual setup</p>
                <p className="mt-3 font-display text-display-sm text-ink">Five vendors. Five versions of success.</p>
              </div>
              <div className="hidden sm:block"><Scatter /></div>
            </div>
            <dl className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
              {fragmented.map((f) => (
                <div key={f.who} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="font-medium text-ink">{f.who}</dt>
                  <dd className="text-right text-ink-soft">{f.reports}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.12} className="on-dark rounded bg-forest p-7 text-ivory sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow text-ivory/65">A Springs 360 growth system</p>
                <p className="mt-3 font-display text-display-sm">One journey. One number that matters.</p>
              </div>
              <div className="hidden sm:block"><Loop /></div>
            </div>
            <ul className="mt-10 divide-y divide-ivory/10 border-t border-ivory/10">
              {connected.map((c) => (
                <li key={c} className="flex items-baseline gap-4 py-4 text-ivory/85">
                  <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
