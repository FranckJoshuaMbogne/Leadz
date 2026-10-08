import { Seo, organizationLd, professionalServiceLd, websiteLd } from "@/lib/seo";
import { site } from "@/config/site";
import { pillars } from "@/data/services";
import { Hero } from "@/components/sections/home/Hero";
import { BrandStatement } from "@/components/sections/home/BrandStatement";
import { Problem } from "@/components/sections/home/Problem";
import { GrowthSystem } from "@/components/sections/home/GrowthSystem";
import { Capabilities } from "@/components/sections/home/Capabilities";
import { SelectedWork } from "@/components/sections/home/SelectedWork";
import { WhySprings } from "@/components/sections/home/WhySprings";
import { IndustriesPreview } from "@/components/sections/home/IndustriesPreview";
import { InsightsPreview } from "@/components/sections/home/InsightsPreview";
import { Philosophy } from "@/components/sections/home/Philosophy";
import { CtaBand } from "@/components/sections/CtaBand";

export default function Home() {
  return (
    <>
      <Seo
        title={`${site.name} — Growth Systems for Ambitious Businesses`}
        description={site.description}
        path="/"
        jsonLd={[
          organizationLd(),
          websiteLd(),
          professionalServiceLd({ serviceTypes: pillars.map((p) => p.name) }),
        ]}
      />
      <Hero />
      <BrandStatement />
      <Problem />
      <GrowthSystem />
      <Capabilities />
      <SelectedWork />
      <WhySprings />
      <IndustriesPreview />
      <InsightsPreview />
      <Philosophy />
      <CtaBand />
    </>
  );
}
