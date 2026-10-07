import { Seo, breadcrumbLd } from "@/lib/seo";
import { site } from "@/config/site";
import { StrategyCallForm } from "@/components/forms/StrategyCallForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskText } from "@/components/animations/MaskText";
import { HeroField } from "@/components/art/HeroField";

const expectations = [
  { t: "Before the call", d: "We review your website, channels and anything you share, so the conversation starts with substance." },
  { t: "On the call", d: "30 minutes on your goals, where growth is being lost, and the first moves we would make." },
  { t: "After the call", d: "A short written summary of what we discussed and recommended — yours to keep, whether or not we work together." },
];

export default function Book() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Book a Strategy Call", path: "/book" },
  ];
  return (
    <>
      <Seo
        title="Book a Strategy Call"
        description="Book a 30-minute strategy call with Springs 360. We'll identify where growth is being lost and what a connected growth system would change."
        path="/book"
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <section className="bg-ivory">
        <div className="grid lg:min-h-screen lg:grid-cols-12">
          <div className="on-dark relative isolate overflow-hidden bg-deep px-gutter pb-14 pt-32 text-ivory lg:col-span-5 lg:pb-16 lg:pt-40 lg:pr-12">
            <HeroField className="absolute -bottom-1/4 -right-1/2 -z-10 h-[80%] w-[160%] opacity-30" />
            <div className="lg:sticky lg:top-32">
              <Breadcrumbs items={crumbs} light className="anim-fade-up mb-10" />
              <Eyebrow light>Strategy call</Eyebrow>
              <h1 className="mt-6 font-display text-display-lg">
                <MaskText lines={["Let's find your", <em key="g" className="italic">growth opportunity.</em>]} delay={0.1} />
              </h1>
              <p className="anim-fade-up mt-6 max-w-md text-lead text-ivory/75" style={{ animationDelay: "0.3s" }}>
                A focused conversation about your business — not a sales pitch. Answer a few questions so we can prepare.
              </p>
              <ol className="anim-fade-up mt-12 space-y-6 border-t border-ivory/15 pt-8" style={{ animationDelay: "0.4s" }}>
                {expectations.map((e, i) => (
                  <li key={e.t} className="grid grid-cols-[2.5rem_1fr]">
                    <span className="text-sm tabular-nums text-gold-light">0{i + 1}</span>
                    <div>
                      <p className="font-medium">{e.t}</p>
                      <p className="mt-1 text-sm text-ivory/70">{e.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-10 text-sm text-ivory/70">
                Prefer to talk now?{" "}
                <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-ivory underline decoration-gold underline-offset-4">
                  WhatsApp us
                </a>{" "}
                or call{" "}
                <a href={site.contact.phoneHref} className="text-ivory underline decoration-gold underline-offset-4">
                  {site.contact.phoneDisplay}
                </a>
                .
              </p>
            </div>
          </div>
          <div className="px-gutter py-14 lg:col-span-7 lg:px-16 lg:py-40 xl:px-24">
            <div className="mx-auto max-w-2xl">
              <StrategyCallForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
