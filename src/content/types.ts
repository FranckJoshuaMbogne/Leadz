import type { CatalogItem, StageKey } from "@/data/catalog";
import type { Pillar, Service } from "@/data/services";
import type { CaseStudy } from "@/data/caseStudies";
import type { Industry } from "@/data/industries";
import type { GrowthStage } from "@/data/growthSystem";

export type { CatalogItem, Pillar, Service, CaseStudy, Industry, GrowthStage };

/**
 * Everything editable in /admin. Stored in Firestore, collection `content`,
 * one document per section. Images are "media:<id>" references (uploaded in
 * the admin) or plain URLs.
 */
export interface Settings {
  phone: string;
  phoneDisplay: string;
  whatsappText: string;
  email: string;
  hours: string;
  address: string;
  social: { label: string; href: string }[];
  ctaLabel: string;
  ctaHref: string;
  heroEyebrow: string;
  /** Three lines. Wrap words in *asterisks* to colour them gold. */
  heroLines: string[];
  heroSubtitle: string;
  heroText: string;
  reassurance: string[];
  /** Optional photo/visual replacing the animated hero collage. */
  heroImage: string;
  showreel: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Content {
  settings: Settings;
  catalog: CatalogItem[];
  stages: { key: StageKey; title: string; text: string }[];
  growth: GrowthStage[];
  pillars: Pillar[];
  services: Service[];
  work: CaseStudy[];
  industries: Industry[];
  faqs: Faq[];
}
