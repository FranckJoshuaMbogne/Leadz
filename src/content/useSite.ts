import { useMemo } from "react";
import { useContent } from "./ContentProvider";
import type { PillarSlug } from "@/data/services";

/** Content plus the lookup helpers pages need (replaces the old data helpers). */
export function useSite() {
  const c = useContent();
  return useMemo(() => {
    const work = c.work.filter((w) => w.published !== false);
    const locations = c.locations.filter((l) => l.published !== false);
    const sortedCaseStudies = [...work].sort((a, b) => Number(b.verified) - Number(a.verified));
    return {
      ...c,
      work,
      locations,
      sortedCaseStudies,
      hasVerifiedWork: work.some((w) => w.verified),
      topServices: c.catalog.filter((x) => x.top),
      getPillar: (slug: string) => c.pillars.find((p) => p.slug === slug),
      getService: (slug: string) => c.services.find((s) => s.slug === slug),
      servicesForPillar: (slug: PillarSlug | string) => c.services.filter((s) => s.pillar === slug),
      getCaseStudy: (slug: string) => work.find((w) => w.slug === slug),
      getIndustry: (slug: string) => c.industries.find((i) => i.slug === slug),
      getLocation: (slug: string) => locations.find((l) => l.slug === slug),
    };
  }, [c]);
}
