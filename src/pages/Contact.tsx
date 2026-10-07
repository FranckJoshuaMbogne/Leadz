import { Seo, breadcrumbLd, organizationLd } from "@/lib/seo";
import { site } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function Contact() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with Springs 360 — by phone, WhatsApp or message. For growth projects, book a strategy call."
        path="/contact"
        jsonLd={[organizationLd(), breadcrumbLd(crumbs)]}
      />
      <PageHero eyebrow="Contact" titleLines={["Start a", <em key="c" className="italic">conversation.</em>]} breadcrumbs={crumbs} art={{ seed: "contact", variant: "orbit" }} />
      <section className="bg-ivory py-section-sm">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rounded bg-forest p-8 text-ivory">
              <p className="eyebrow text-ivory/65">Growth project?</p>
              <p className="mt-4 font-display text-display-sm">The fastest route is a strategy call.</p>
              <p className="mt-3 text-ivory/75">Answer a few questions and we'll come prepared.</p>
              <ButtonLink to="/book" variant="light" className="mt-8">
                Book a Strategy Call
              </ButtonLink>
            </div>
            <dl className="mt-12 space-y-8">
              <div>
                <dt className="eyebrow text-ink-muted">Phone</dt>
                <dd className="mt-2 text-lg">
                  <a href={site.contact.phoneHref} className="link-underline">{site.contact.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-muted">WhatsApp</dt>
                <dd className="mt-2 text-lg">
                  <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="link-underline">
                    Message us
                  </a>
                </dd>
              </div>
              {site.contact.email && (
                <div>
                  <dt className="eyebrow text-ink-muted">Email</dt>
                  <dd className="mt-2 text-lg">
                    <a href={`mailto:${site.contact.email}`} className="link-underline">{site.contact.email}</a>
                  </dd>
                </div>
              )}
              {site.contact.address && (
                <div>
                  <dt className="eyebrow text-ink-muted">Studio</dt>
                  <dd className="mt-2 text-lg">{site.contact.address}</dd>
                </div>
              )}
              <div>
                <dt className="eyebrow text-ink-muted">Hours</dt>
                <dd className="mt-2 text-lg">{site.contact.hours}</dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Eyebrow>General enquiries</Eyebrow>
            <h2 className="mb-10 mt-6 font-display text-display-md text-ink">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
