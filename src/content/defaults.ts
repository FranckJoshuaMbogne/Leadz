import type { Content } from "./types";
import { settings } from "@/data/settings";
import { catalog, stages } from "@/data/catalog";
import { growthStages } from "@/data/growthSystem";
import { pillars, services } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import { industries } from "@/data/industries";
import { homeFaqs } from "@/data/faqs";
import { locations } from "@/data/locations";

export const defaultContent: Content = {
  settings,
  catalog,
  stages,
  growth: growthStages,
  pillars,
  services,
  work: caseStudies.map((c) => ({ ...c, published: c.published ?? true })),
  industries,
  locations,
  faqs: homeFaqs,
};

/** Firestore document ids (collection `content`). */
export const sectionIds = ["settings", "catalog", "growth", "pillars", "services", "work", "industries", "locations", "faqs"] as const;
export type SectionId = (typeof sectionIds)[number];

type Docs = Record<string, Record<string, unknown> | undefined>;

function items<T>(docs: Docs, id: string, fallback: T[], key = "items"): T[] {
  const v = docs[id]?.[key];
  return Array.isArray(v) ? (v as T[]) : fallback;
}

/** Merge Firestore `content/*` documents over the built-in content. */
export function mergeContent(docs: Docs, base: Content = defaultContent): Content {
  return {
    settings: { ...base.settings, ...((docs.settings as object) ?? {}) },
    catalog: items(docs, "catalog", base.catalog),
    stages: items(docs, "catalog", base.stages, "stages"),
    growth: items(docs, "growth", base.growth),
    pillars: items(docs, "pillars", base.pillars),
    services: items(docs, "services", base.services),
    work: items(docs, "work", base.work).map((w) => ({ ...w, published: w.published !== false })),
    industries: items(docs, "industries", base.industries),
    locations: items(docs, "locations", base.locations).map((l) => ({ ...l, published: l.published !== false })),
    faqs: items(docs, "faqs", base.faqs),
  };
}

/** One section of the content as its Firestore document. */
export function sectionDoc(c: Content, id: SectionId): Record<string, unknown> {
  switch (id) {
    case "settings":
      return { ...c.settings };
    case "catalog":
      return { items: c.catalog, stages: c.stages };
    case "growth":
      return { items: c.growth };
    default:
      return { items: c[id] };
  }
}
