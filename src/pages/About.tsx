import { Seo, breadcrumbLd, organizationLd } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { principles } from "@/components/sections/home/Philosophy";
import { growthStages } from "@/data/growthSystem";
import { CoverArt } from "@/components/art/CoverArt";
import { Parallax } from "@/components/animations/Parallax";

const fit = [
  "You have a proven product or service and want growth to be less dependent on luck or referrals.",
  "You are spending on marketing but cannot say clearly what each channel returns.",
  "Leads arrive, but follow-up, conversion or retention is where they disappear.",
  "You want one accountable partner rather than a stack of disconnected vendors.",
];

const technology = [
  { title: "Technology serves the strategy", text: "We choose tools after we understand the journey, not before. The best stack is the simplest one that does the job." },
  { title: "AI with guardrails", text: "We use AI where it makes customers' experience faster and better — and keep people involved where judgement and trust matter." },
  { title: "You own everything", text: "Accounts, data, CRM, websites and automations are set up in your name and documented, so your business is never locked in." },
];

export default function About() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];
  return (
    <>
      <Seo
        title="About — Why Springs 360 Exists"
        description="Springs 360 exists to connect strategy, marketing, technology and data into one growth system. Our beliefs, approach and the businesses we work best with."
        path="/about"
        jsonLd={[organizationLd(), breadcrumbLd(crumbs)]}
      />
      <PageHero
        eyebrow="About Springs 360"
        titleLines={["Growth is a system.", <em key="t" className="italic">We build it whole.</em>]}
        breadcrumbs={crumbs}
        art={{ seed: "about-hero", variant: "contour" }}
      />

      <section aria-labelledby="why" className="bg-ivory py-section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="01">Why we exist</Eyebrow>
          </div>
          <div className="space-y-8 lg:col-span-8">
            <Reveal>
              <h2 id="why" className="font-display text-display-md text-ink">
                Businesses don't struggle because they lack marketing. They struggle because the pieces don't connect.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-prose text-lead text-ink-muted">
                A typical growing company has an ads agency, a web developer, a social media freelancer, a CRM the sales team
                half-uses and analytics no one fully trusts. Each is competent in isolation. Together, they produce activity
                without accountability — and growth that depends on luck.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="max-w-prose text-lead text-ink-muted">
                The name says what we do. A spring is a source — something that flows continuously, not in bursts. 360 is the
                whole journey: from the first moment of attention to the repeat purchase and back again. Springs 360 exists to
                design and run that journey as one system.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bg-ivory">
        <div className="container-site">
          <Parallax className="aspect-[16/9] rounded md:aspect-[21/8]" strength={30}>
            <CoverArt seed="about-band" variant="flow" tone="forest" />
          </Parallax>
        </div>
      </div>

      <section aria-labelledby="believe" className="bg-ivory py-section">
        <div className="container-site">
          <Eyebrow index="02">What we believe</Eyebrow>
          <h2 id="believe" className="sr-only">
            What we believe
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded border border-ink/10 bg-ink/10 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 2) * 0.06} className="bg-ivory-50 p-8 sm:p-10">
                <p className="text-sm tabular-nums text-gold-dark">0{i + 1}</p>
                <h3 className="mt-8 font-display text-display-sm text-ink">{p.title}</h3>
                <p className="mt-3 max-w-md text-ink-muted">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="approach" className="on-dark bg-deep py-section text-ivory">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow light index="03">
              How strategy and execution connect
            </Eyebrow>
            <Reveal>
              <h2 id="approach" className="mt-6 font-display text-display-md">
                The people who plan the system are the people who <em className="italic">build and run it.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 text-lead text-ivory/75">
                Every engagement follows the same operating rhythm: diagnose, design, build, measure, improve. Strategy is
                revisited every month against real numbers — not filed after the kick-off.
              </p>
            </Reveal>
          </div>
          <ol className="border-t border-ivory/15 lg:col-span-6 lg:col-start-7">
            {growthStages.map((s) => (
              <Reveal as="li" key={s.name} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ivory/15 py-6">
                <span className="text-sm tabular-nums text-gold-light">{s.index}</span>
                <div>
                  <h3 className="font-display text-2xl italic">{s.name}</h3>
                  <p className="mt-2 text-ivory/70">{s.verb}.</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="tech" className="bg-ivory py-section">
        <div className="container-site">
          <Eyebrow index="04">How we use technology</Eyebrow>
          <h2 id="tech" className="sr-only">
            How we use technology
          </h2>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {technology.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08} className="border-t border-ink/15 pt-8">
                <h3 className="font-display text-display-sm text-ink">{t.title}</h3>
                <p className="mt-4 text-ink-muted">{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="fit" className="bg-sage py-section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow index="05">Who we work with</Eyebrow>
            <Reveal>
              <h2 id="fit" className="mt-6 font-display text-display-md text-ink">
                Ambitious businesses ready to treat growth as a system.
              </h2>
            </Reveal>
          </div>
          <ul className="border-t border-ink/15 lg:col-span-6 lg:col-start-7">
            {fit.map((f) => (
              <Reveal as="li" key={f} className="flex gap-4 border-b border-ink/15 py-5 text-lead text-ink">
                <span aria-hidden="true" className="mt-3.5 h-px w-4 shrink-0 bg-gold-dark" />
                {f}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
