import { useLocation } from "react-router-dom";
import { Seo } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { staticInsights } from "@/data/insights";
import { InsightCard } from "@/components/cards/InsightCard";

export default function ThankYou() {
  const state = (useLocation().state ?? {}) as { name?: string; intent?: string };
  const call = state.intent !== "general";
  return (
    <>
      <Seo title="Thank you" description="Your request has been received." path="/thank-you" noindex />
      <section className="on-dark bg-deep text-ivory">
        <div className="container-site pb-20 pt-36 md:pt-48">
          <p className="eyebrow text-gold-light">Request received</p>
          <h1 className="mt-6 max-w-4xl font-display text-display-xl">
            Thank you{state.name ? `, ${state.name}` : ""}. <em className="italic">We'll be in touch.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lead text-ivory/75">
            {call
              ? "A strategist will review your answers and reply within one business day with times for your call. If anything is urgent, WhatsApp is the quickest way to reach us."
              : "We've received your message and will reply within one business day."}
          </p>
          <div className="mt-10 flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-8">
            <ButtonLink to="/insights" variant="light">
              Read our insights
            </ButtonLink>
            <ButtonLink to="/" variant="text-light">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="bg-ivory py-section-sm">
        <div className="container-site">
          <h2 className="eyebrow text-ink-muted">While you wait</h2>
          <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-8">
            {staticInsights.slice(0, 3).map((i) => (
              <InsightCard key={i.slug} insight={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
