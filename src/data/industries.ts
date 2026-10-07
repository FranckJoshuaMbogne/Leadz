import type { ArtVariant } from "@/components/art/CoverArt";

/**
 * Industries are framed as business problems Springs 360 is set up to solve.
 * They deliberately do not claim past client experience — link real case
 * studies through `caseStudies.industrySlug` once they exist.
 */
export interface Industry {
  slug: string;
  name: string;
  summary: string;
  problems: string[];
  solution: string;
  capabilities: string[]; // service slugs
  art: ArtVariant;
}

export const industries: Industry[] = [
  {
    slug: "fashion-luxury",
    name: "Fashion & Luxury",
    summary: "Brands where perception, craft and experience justify the price.",
    problems: [
      "Performance marketing that discounts the brand to chase conversions",
      "Long consideration cycles that last-click reporting undervalues",
      "Online experiences that fall short of the in-store or atelier standard",
    ],
    solution:
      "Editorial digital experiences, audience-led paid media that protects positioning, and clienteling-style nurture through WhatsApp and email — measured on customer value, not just first orders.",
    capabilities: ["ecommerce", "meta-ads", "whatsapp-automation", "business-intelligence"],
    art: "contour",
  },
  {
    slug: "retail",
    name: "Retail",
    summary: "Multi-location and omnichannel retailers connecting stores and screens.",
    problems: ["Online activity that never gets credit for store visits", "Fragmented customer data across POS, ecommerce and marketing", "Promotions that drive volume but not loyalty"],
    solution: "Local search and store-level campaigns, unified customer data and lifecycle messaging that brings customers back in-store and online.",
    capabilities: ["local-seo", "google-ads", "email-marketing", "analytics"],
    art: "grid",
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    summary: "Hotels, restaurants and venues competing with platforms for their own guests.",
    problems: ["Commission paid to third-party booking platforms", "Seasonal demand swings", "Little contact with guests after they leave"],
    solution: "Direct-booking campaigns, conversion-led booking journeys and guest lifecycle messaging that make booking direct the obvious choice.",
    capabilities: ["google-ads", "cro", "email-marketing", "meta-ads"],
    art: "flow",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    summary: "Developers, brokerages and agents with high-value, long-cycle sales.",
    problems: ["High volumes of unqualified enquiries", "Slow follow-up on time-sensitive leads", "Little insight into which campaigns lead to site visits and sales"],
    solution: "Project-level campaigns, conversational qualification over WhatsApp and CRM pipelines that track every lead from enquiry to site visit and booking.",
    capabilities: ["meta-ads", "whatsapp-automation", "crm-automation", "business-intelligence"],
    art: "orbit",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    summary: "Clinics and practices where trust, responsiveness and compliance matter.",
    problems: ["Appointment gaps and no-shows", "Front desks overwhelmed by routine questions", "Advertising rules that limit what can be said"],
    solution: "Compliant search and local visibility, appointment automation and carefully scoped assistants that answer routine questions and route the rest to staff.",
    capabilities: ["local-seo", "google-ads", "whatsapp-automation", "ai-chatbots"],
    art: "rings",
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    summary: "Law, accounting, consulting and advisory firms built on expertise and reputation.",
    problems: ["Reliance on referrals and partner networks", "Expertise that is invisible online", "Intake processes that lose prospects"],
    solution: "Authority-building content and SEO, practice-area campaigns, and intake systems that respond quickly and book consultations without back-and-forth.",
    capabilities: ["local-seo", "website-development", "sales-funnels", "crm-automation"],
    art: "contour",
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    summary: "Advisers, lenders and fintechs operating in regulated, trust-heavy markets.",
    problems: ["High acquisition costs in competitive categories", "Complex products that need education before conversion", "Strict compliance requirements on messaging and data"],
    solution: "Education-led content and nurture, carefully governed paid acquisition and analytics that tie spend to funded accounts or clients — built with compliance review in the loop.",
    capabilities: ["growth-strategy", "email-marketing", "analytics", "landing-pages"],
    art: "grid",
  },
  {
    slug: "technology",
    name: "Technology",
    summary: "SaaS and technology companies selling to businesses.",
    problems: ["Demo requests that do not become pipeline", "Attribution gaps between marketing and sales", "Content that does not reach buyers in-market"],
    solution: "Intent-led search and content, funnel automation between sign-up, demo and close, and attribution that connects spend to revenue.",
    capabilities: ["google-ads", "sales-funnels", "business-intelligence", "analytics"],
    art: "orbit",
  },
  {
    slug: "ecommerce",
    name: "Ecommerce",
    summary: "Direct-to-consumer brands growing online revenue profitably.",
    problems: ["Rising acquisition costs on paid social", "Low repeat purchase rates", "Store experiences that leak conversions"],
    solution: "Creative-led paid social, conversion optimisation across the store and retention flows that increase lifetime value.",
    capabilities: ["ecommerce", "meta-ads", "cro", "email-marketing"],
    art: "flow",
  },
  {
    slug: "local-businesses",
    name: "Local Businesses",
    summary: "Service businesses that win customers within a defined area.",
    problems: ["Unpredictable enquiry volume", "Competitors dominating local search", "No time to follow up every lead"],
    solution: "Local SEO and search ads for the services that matter most, simple landing pages and automated follow-up that books jobs while you work.",
    capabilities: ["local-seo", "google-ads", "landing-pages", "crm-automation"],
    art: "rings",
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
