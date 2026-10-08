import { Seo } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { HeroField } from "@/components/art/HeroField";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for could not be found." path="/404" noindex status={404} />
      <section className="on-dark relative isolate flex min-h-[90svh] items-center overflow-hidden bg-deep text-ivory">
        <HeroField className="absolute inset-0 -z-10 h-full w-full opacity-30" />
        <div className="container-site py-32">
          <p className="eyebrow text-gold-light">Error 404</p>
          <h1 className="mt-6 max-w-3xl font-display text-display-xl">
            This page has left the <em className="italic">loop.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-ivory/75">It may have moved, or the link may be out of date. These will get you back on track.</p>
          <div className="mt-10 flex flex-col gap-4 xs:flex-row xs:flex-wrap xs:items-center xs:gap-6">
            <ButtonLink to="/" variant="light">
              Back to home
            </ButtonLink>
            <ButtonLink to="/services" variant="text-light">
              Services
            </ButtonLink>
            <ButtonLink to="/insights" variant="text-light">
              Insights
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
