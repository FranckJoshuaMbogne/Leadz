import { Link } from "react-router-dom";
import { Seo, areaServedLd, breadcrumbLd, professionalServiceLd } from "@/lib/seo";
import { useSite } from "@/content/useSite";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Arrow } from "@/components/ui/Button";

export default function Locations() {
  const { locations, catalog } = useSite();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
  ];
  const names = locations.map((l) => l.city);
  return (
    <>
      <Seo
        title={`Digital Marketing Agency in ${names.join(", ")}`}
        description={`Springs 360 runs Google Ads, Meta Ads, local SEO, websites, social media and WhatsApp lead follow-up for businesses in ${names.join(", ")}.`}
        path="/locations"
        jsonLd={[professionalServiceLd({ path: "/locations", serviceTypes: catalog.map((c) => c.label), areaServed: areaServedLd(locations) }), breadcrumbLd(crumbs)]}
      />
      <PageHero eyebrow="Locations" titleLines={["Where we help", <em key="e" className="italic">businesses grow.</em>]} intro="Local campaigns, Google rankings and lead follow-up, targeted to the cities and neighbourhoods your customers live in." breadcrumbs={crumbs} />
      <section className="bg-ivory py-section">
        <ul className="container-site grid gap-px overflow-hidden rounded border border-ink/10 bg-ink/10 md:grid-cols-3">
          {locations.map((l) => (
            <li key={l.slug} className="bg-ivory-50">
              <Link to={`/locations/${l.slug}`} className="group/btn flex h-full flex-col p-8">
                <span className="eyebrow text-ink-soft">{l.region}</span>
                <h2 className="mt-6 font-display text-display-sm text-ink">Digital marketing in {l.city}</h2>
                <p className="mt-3 flex-1 text-ink-muted">{l.areas.slice(0, 5).join(" · ")}</p>
                <Arrow className="mt-6 text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
