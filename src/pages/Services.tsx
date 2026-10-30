import { Seo, breadcrumbLd, faqLd, professionalServiceLd, areaServedLd } from "@/lib/seo";
import { useSite } from "@/content/useSite";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { GrowthSystem } from "@/components/sections/GrowthSystem";
import { FaqSection } from "@/components/sections/FaqSection";
import { ServiceTile } from "@/components/cards/ServiceTile";
import { Reveal } from "@/components/animations/Reveal";
import { ButtonA, ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useContact } from "@/content/ContentProvider";


export default function Services() {
  const contact = useContact();
  const { catalog, topServices, faqs: homeFaqs, locations } = useSite();
  const engagementFaqs = [
  homeFaqs[0],
  homeFaqs[1],
  {
    question: "Do we have to use all your services?",
    answer:
      "No. Start with what you need most — often social media, ads or a website — and add more later. We always show you how each piece fits the full 360° picture.",
  },
  homeFaqs[3],
  homeFaqs[4],
  ].filter(Boolean) as { question: string; answer: string }[];
  const more = catalog.filter((c) => !c.top);
  return (
    <>
      <Seo
        title="Digital Marketing Services — Social Media, Ads, Websites & More"
        description="We create a 360° ecosystem to boost your sales: social media management, Meta & Google Ads, website development, content, branding, design & video, promotions, Google Business Profile, lead management and more."
        path="/services"
        jsonLd={[
          professionalServiceLd({ path: "/services", serviceTypes: catalog.map((c) => c.label), areaServed: areaServedLd(locations) }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          faqLd(engagementFaqs),
        ]}
      />
      <PageHero
        eyebrow="Our services"
        titleLines={["We create a 360° ecosystem", <em key="e">to boost your sales.</em>]}
        intro="Social media, ads, websites, content, design and the follow-up that turns enquiries into customers — handled by one team, with one plan and one simple monthly report."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        art={{ seed: "services-hero", variant: "flow" }}
      >
        <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap">
          <ButtonLink to="/book" variant="light" size="lg">
            Get a Free Strategy Call
          </ButtonLink>
          <ButtonA href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" variant="outline-light" size="lg" arrow={false}>
            Chat on WhatsApp
          </ButtonA>
        </div>
      </PageHero>

      <section aria-labelledby="main-services" className="bg-ivory py-section-sm">
        <div className="container-site">
          <SectionHeader
            eyebrow="Most requested"
            title={<span id="main-services">What we can do for you</span>}
            intro="Choose one service or combine them. Click any service to see what's included."
          />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {topServices.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 4) * 0.05}>
                <ServiceTile item={s} />
              </Reveal>
            ))}
          </ul>

          <h3 className="mt-16 font-display text-display-sm text-ink">More services</h3>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {more.map((s) => (
              <li key={s.slug}>
                <ServiceTile item={s} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <GrowthSystem />
      <HowItWorks light />
      <FaqSection faqs={engagementFaqs} />
      <CtaBand eyebrow="Not sure where to start?" title="Tell us your goal. We'll suggest the right mix." cta="Get a Free Strategy Call" />
    </>
  );
}
