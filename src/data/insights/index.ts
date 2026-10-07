import type { ArtVariant, ArtTone } from "@/components/art/CoverArt";

export const insightCategories = ["Growth", "Marketing", "AI", "Automation", "Data", "Strategy", "Ecommerce", "Case Studies"] as const;
export type InsightCategory = (typeof insightCategories)[number];

export const EDITORIAL_AUTHOR = "Springs 360 Editorial";

/** Article metadata. Bodies live in ./content.ts so list pages stay light. */
export interface InsightMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: InsightCategory | string;
  author: string;
  publishedAt: string; // ISO date
  updatedAt?: string;
  readingMinutes: number;
  coverImage?: string;
  coverAlt?: string;
  art?: { variant: ArtVariant; tone: ArtTone };
  seoTitle?: string;
  seoDescription?: string;
  /** Slug of the most relevant service page. */
  relatedService?: string;
  featured?: boolean;
  source: "static" | "cms";
}

export interface Insight extends InsightMeta {
  content: string;
}

/**
 * Editorial articles shipped with the site. Dates are the date each piece was
 * written for this site; update `publishedAt` if launch happens later.
 * Articles published from the admin CMS (Firestore) are merged in at runtime
 * and at build time.
 */
export const staticInsights: InsightMeta[] = [
  {
    slug: "predictable-customer-acquisition-system",
    title: "How to build a predictable customer acquisition system",
    excerpt:
      "Predictable growth does not come from a better campaign. It comes from connecting attention, conversion and follow-up into a system you can measure and improve.",
    category: "Growth",
    author: EDITORIAL_AUTHOR,
    publishedAt: "2026-10-07",
    readingMinutes: 3,
    art: { variant: "flow", tone: "deep" },
    seoTitle: "How to Build a Predictable Customer Acquisition System",
    seoDescription:
      "A practical framework for turning marketing into a predictable acquisition system: unit economics, channel roles, conversion, follow-up and measurement.",
    relatedService: "growth-strategy",
    featured: true,
    source: "static",
  },
  {
    slug: "google-ads-vs-meta-ads",
    title: "Google Ads vs Meta Ads: which should you invest in first?",
    excerpt:
      "One captures demand that already exists; the other creates it. The right starting point depends on how your customers buy — not which platform is fashionable.",
    category: "Marketing",
    author: EDITORIAL_AUTHOR,
    publishedAt: "2026-10-07",
    readingMinutes: 2,
    art: { variant: "orbit", tone: "forest" },
    seoTitle: "Google Ads vs Meta Ads: Which Should Your Business Use First?",
    seoDescription:
      "Compare Google Ads and Meta Ads by intent, creative needs, measurement and cost so you can decide where to invest first.",
    relatedService: "google-ads",
    source: "static",
  },
  {
    slug: "how-ai-changes-lead-nurturing",
    title: "How AI changes lead nurturing — and what it should not do",
    excerpt:
      "AI can answer instantly, qualify consistently and personalise at scale. Used carelessly, it can also erode the trust you are trying to build.",
    category: "AI",
    author: EDITORIAL_AUTHOR,
    publishedAt: "2026-10-07",
    readingMinutes: 2,
    art: { variant: "rings", tone: "sage" },
    seoTitle: "How AI Changes Lead Nurturing (and Where to Keep Humans)",
    seoDescription:
      "Where AI genuinely improves lead nurturing — response speed, qualification, personalisation — and the guardrails that keep it trustworthy.",
    relatedService: "ai-chatbots",
    source: "static",
  },
  {
    slug: "why-businesses-lose-leads-after-acquisition",
    title: "Why businesses lose leads after they have already paid for them",
    excerpt:
      "Most growth problems are diagnosed as traffic problems. Very often, the leak is between the enquiry and the first real conversation.",
    category: "Strategy",
    author: EDITORIAL_AUTHOR,
    publishedAt: "2026-10-07",
    readingMinutes: 2,
    art: { variant: "contour", tone: "forest" },
    seoTitle: "Why Businesses Lose Leads After Acquisition — and How to Fix It",
    seoDescription:
      "The common reasons paid-for leads never become customers — slow response, poor routing, no nurture — and a practical plan to fix each.",
    relatedService: "crm-automation",
    source: "static",
  },
  {
    slug: "connect-crm-and-marketing",
    title: "How to connect your CRM and marketing so both get smarter",
    excerpt:
      "When marketing stops at the form and sales starts in the CRM, both teams work half-blind. Connecting them is a process problem first and a technology problem second.",
    category: "Automation",
    author: EDITORIAL_AUTHOR,
    publishedAt: "2026-10-07",
    readingMinutes: 2,
    art: { variant: "grid", tone: "deep" },
    seoTitle: "How to Connect Your CRM and Marketing: A Practical Guide",
    seoDescription:
      "A step-by-step guide to connecting CRM and marketing: shared definitions, lead source capture, offline conversion imports and closed-loop reporting.",
    relatedService: "crm-automation",
    source: "static",
  },
  {
    slug: "how-to-measure-marketing-roi",
    title: "How to measure marketing ROI without fooling yourself",
    excerpt:
      "Platform dashboards are not a profit and loss statement. A useful ROI model starts with margin, includes all costs and accepts the limits of attribution.",
    category: "Data",
    author: EDITORIAL_AUTHOR,
    publishedAt: "2026-10-07",
    readingMinutes: 2,
    art: { variant: "grid", tone: "ivory" },
    seoTitle: "How to Measure Marketing ROI Accurately",
    seoDescription:
      "A clear method for measuring marketing ROI: margin-based returns, full costs, attribution choices, incrementality and a reporting rhythm that drives decisions.",
    relatedService: "business-intelligence",
    source: "static",
  },
  {
    slug: "high-converting-landing-pages",
    title: "What actually makes a landing page convert",
    excerpt:
      "Conversion is rarely about button colours. It comes from matching the visitor's intent, making a specific promise and removing every reason to hesitate.",
    category: "Marketing",
    author: EDITORIAL_AUTHOR,
    publishedAt: "2026-10-07",
    readingMinutes: 2,
    art: { variant: "contour", tone: "sage" },
    seoTitle: "How to Build High-Converting Landing Pages",
    seoDescription:
      "The principles behind high-converting landing pages: message match, a specific offer, credible proof, low friction and disciplined testing.",
    relatedService: "landing-pages",
    source: "static",
  },
  {
    slug: "marketing-automation-for-growing-businesses",
    title: "Marketing automation for growing businesses: where to start",
    excerpt:
      "Automation is most valuable when it removes delay and repetition from moments that matter. Start there — not with the most impressive workflow diagram.",
    category: "Automation",
    author: EDITORIAL_AUTHOR,
    publishedAt: "2026-10-07",
    readingMinutes: 2,
    art: { variant: "orbit", tone: "deep" },
    seoTitle: "Marketing Automation for Growing Businesses: Where to Start",
    seoDescription:
      "A prioritised approach to marketing automation for growing businesses — the first five workflows worth building and how to keep them reliable.",
    relatedService: "marketing-automation",
    source: "static",
  },
];
