import { Seo, faqLd, organizationLd, professionalServiceLd, websiteLd } from "@/lib/seo";
import { site } from "@/config/site";
import { catalog } from "@/data/catalog";
import { homeFaqs } from "@/data/faqs";
import { Hero } from "@/components/sections/home/Hero";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { Problem } from "@/components/sections/home/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { EcosystemStages } from "@/components/sections/EcosystemStages";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { WhySprings } from "@/components/sections/home/WhySprings";
import { IndustriesPreview } from "@/components/sections/home/IndustriesPreview";
import { InsightsPreview } from "@/components/sections/home/InsightsPreview";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";

export default function Home() {
  return (
    <>
      <Seo
        title={`${site.name} — Your All-in-One 360° Digital Marketing Agency`}
        description="Springs 360 is an all-in-one 360° digital marketing agency: social media, Meta & Google Ads, websites, content, branding and lead management — one team that brings you customers."
        path="/"
        jsonLd={[
          organizationLd(),
          websiteLd(),
          professionalServiceLd({ serviceTypes: catalog.map((c) => c.label) }),
          faqLd(homeFaqs),
        ]}
      />
      <Hero />
      <ServicesGrid />
      <Problem />
      <HowItWorks />
      <EcosystemStages />
      <SelectedWork />
      <WhySprings />
      <IndustriesPreview />
      <FaqSection faqs={homeFaqs} />
      <InsightsPreview />
      <CtaBand />
    </>
  );
}
