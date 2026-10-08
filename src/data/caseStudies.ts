import type { ArtTone, ArtVariant } from "@/components/art/CoverArt";

/**
 * Work / case studies.
 *
 * IMPORTANT — every entry below is an ILLUSTRATIVE SCENARIO carried over from
 * the previous site's demo data (originally "Bright Smile Dental",
 * "Coastline Realty", "Harlow & Rees Law", "The Meridian Hotel",
 * "Vista Health Clinic" and "Northgate SaaS"). Their names, metrics and
 * quotes could not be verified, so client names are anonymised to a
 * descriptor and the UI labels each one "Illustrative".
 *
 * To publish a real case study: add an entry with `verified: true`, the real
 * client name, approved metrics and (optionally) an approved testimonial.
 * Verified entries are shown first and without the illustrative label.
 */

export interface CaseStudy {
  slug: string;
  verified: boolean;
  client: string;
  industry: string;
  industrySlug?: string;
  title: string;
  summary: string;
  challenge: string;
  objective: string;
  strategy: string;
  implementation: string[];
  channels: string[];
  technology: string[];
  results: string[];
  metrics: { label: string; value: string }[];
  lessons: string[];
  testimonial?: { quote: string; author: string; role: string };
  services: string[];
  art: { variant: ArtVariant; tone: ArtTone };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "dental-practice-booking-system",
    verified: false,
    client: "Dental practice",
    industry: "Healthcare",
    industrySlug: "healthcare",
    title: "From referral-dependent to a predictable new-patient system",
    summary: "Search demand, a focused landing page and automated booking working as one path from query to consultation.",
    challenge:
      "New patients came almost entirely through referrals. Some months the chairs were full; others had large gaps, and there was no reliable way to fill them.",
    objective: "Create a steady, measurable flow of booked new-patient consultations at a known cost.",
    strategy:
      "Capture high-intent local search demand, send it to a page built for one decision — booking a consultation — and remove the delay between enquiry and booking.",
    implementation: [
      "Restructured Google Ads around treatment-specific, local-intent searches",
      "Built a dedicated consultation landing page with clear pricing guidance and proof",
      "Added an AI assistant to answer common questions and book out of hours",
      "Connected enquiries to a CRM with automated confirmations and reminders",
    ],
    channels: ["Google Search", "Local SEO", "Website chat"],
    technology: ["Google Ads", "Landing page", "AI assistant", "CRM automation"],
    results: [
      "Consultation bookings rose substantially within the first quarter",
      "Cost per booked consultation fell as campaigns learned from booking data",
      "After-hours enquiries converted instead of waiting for the morning",
    ],
    metrics: [
      { label: "Booked consultations", value: "+240%" },
      { label: "Cost per booking", value: "-31%" },
      { label: "First response", value: "<1 min" },
    ],
    lessons: [
      "Optimising ads toward booked consultations, not form fills, changed which searches received budget.",
      "Speed of response mattered as much as the ad itself.",
    ],
    services: ["google-ads", "landing-pages", "ai-chatbots", "crm-automation"],
    art: { variant: "contour", tone: "forest" },
  },
  {
    slug: "real-estate-lead-qualification",
    verified: false,
    client: "Residential real estate brokerage",
    industry: "Real Estate",
    industrySlug: "real-estate",
    title: "Fewer, better buyer conversations",
    summary: "Paid social rebuilt around qualified buyers, with an AI qualification layer before agents get involved.",
    challenge:
      "Paid social generated high lead volume but low quality. Agents spent hours each week calling people who were not ready, not financed or not in the market.",
    objective: "Increase the share of sales-ready buyers reaching agents without increasing spend.",
    strategy: "Change what the platform optimises for, and qualify before routing — so agents only speak to people who match the brief.",
    implementation: [
      "Rebuilt Meta campaigns with property-specific creative and higher-intent forms",
      "Fed qualified-lead events back to Meta via the Conversions API",
      "Added WhatsApp-based AI qualification for budget, timeline and financing",
      "Routed qualified buyers to agents in the CRM with full context",
    ],
    channels: ["Meta Ads", "WhatsApp", "Retargeting"],
    technology: ["Meta Conversions API", "WhatsApp Business Platform", "AI assistant", "CRM"],
    results: [
      "Cost per qualified buyer lead fell meaningfully at flat spend",
      "Agents spent far less time on unqualified enquiries",
      "Every lead arrived in the CRM with qualification answers attached",
    ],
    metrics: [
      { label: "Cost per qualified lead", value: "-42%" },
      { label: "Lead quality score", value: "+58%" },
      { label: "Agent hours saved", value: "12/wk" },
    ],
    lessons: [
      "Volume is easy to buy on social platforms; quality has to be designed into the signal.",
      "Qualification works best as a conversation, not a longer form.",
    ],
    services: ["meta-ads", "whatsapp-automation", "ai-chatbots", "crm-automation"],
    art: { variant: "orbit", tone: "deep" },
  },
  {
    slug: "law-firm-intake-system",
    verified: false,
    client: "Corporate law firm",
    industry: "Professional Services",
    industrySlug: "professional-services",
    title: "A modern intake system for a referral-led firm",
    summary: "Search, local visibility and automated intake replacing slow, inconsistent word of mouth.",
    challenge:
      "New matters depended on referrals. There was no marketing system, and enquiries that did arrive could wait hours or days for a response.",
    objective: "Build a dependable channel for consultations in priority practice areas and shorten the time from enquiry to booked consult.",
    strategy: "Be visible where prospective clients search, then make booking a consultation simple and immediate.",
    implementation: [
      "Practice-area search campaigns and pages for priority services",
      "Local SEO and Google Business Profile improvements",
      "Automated intake with conflict-check questions and calendar booking",
      "Follow-up sequences for enquiries that did not book",
    ],
    channels: ["Google Search", "Local SEO", "Email"],
    technology: ["Google Ads", "Landing pages", "CRM", "Scheduling automation"],
    results: [
      "A consistent monthly flow of consultations from search",
      "Stronger local visibility for priority practice areas",
      "Intake time reduced from hours to minutes",
    ],
    metrics: [
      { label: "Consultations booked", value: "212" },
      { label: "Local rankings", value: "Top 3" },
      { label: "Intake time", value: "-85%" },
    ],
    lessons: [
      "In professional services, the first response is part of the service.",
      "Practice-area pages outperformed a single generic page for both paid and organic search.",
    ],
    services: ["google-ads", "local-seo", "crm-automation", "sales-funnels"],
    art: { variant: "rings", tone: "sage" },
  },
  {
    slug: "boutique-hotel-direct-bookings",
    verified: false,
    client: "Boutique hotel",
    industry: "Hospitality",
    industrySlug: "hospitality",
    title: "Winning back direct bookings from online travel agencies",
    summary: "Search and social campaigns into a conversion-led booking page, backed by guest email nurture.",
    challenge: "A growing share of bookings came through third-party travel platforms, with commission eroding margin on every stay.",
    objective: "Grow the share of direct bookings and bring past guests back directly.",
    strategy: "Compete for brand and destination searches, make direct booking the obviously better option, and stay in touch with past guests.",
    implementation: [
      "Brand-protection and destination campaigns on Google",
      "Meta campaigns for seasonal offers and lookalike audiences",
      "Booking page redesign with direct-booking benefits and faster load",
      "Past-guest email journeys with direct-only offers",
    ],
    channels: ["Google Ads", "Meta Ads", "Email"],
    technology: ["Booking engine integration", "Analytics", "Email automation"],
    results: [
      "Direct bookings grew quarter on quarter",
      "Booking page conversion improved through iterative testing",
      "Past guests returned through direct channels",
    ],
    metrics: [
      { label: "Direct bookings", value: "+67%" },
      { label: "Page conversion", value: "2.1x" },
      { label: "Repeat guest rate", value: "+24%" },
    ],
    lessons: ["Guests will book direct when the benefit is clear and the experience is as easy as the platforms."],
    services: ["google-ads", "meta-ads", "cro", "email-marketing"],
    art: { variant: "flow", tone: "forest" },
  },
  {
    slug: "health-clinic-automation",
    verified: false,
    client: "Outpatient health clinic",
    industry: "Healthcare",
    industrySlug: "healthcare",
    title: "Fewer no-shows, calmer front desk",
    summary: "Automated reminders, AI triage for routine questions and local SEO for priority services.",
    challenge: "No-shows and slow follow-up left gaps in the schedule, and front-desk staff were overwhelmed by routine calls.",
    objective: "Reduce no-shows, free staff time and grow demand for priority services.",
    strategy: "Automate the predictable parts of patient communication so staff can focus on patients in front of them.",
    implementation: [
      "Automated appointment confirmations and reminders by WhatsApp and SMS",
      "AI assistant for routine questions, with escalation to staff",
      "Local SEO for priority service pages",
    ],
    channels: ["Local SEO", "WhatsApp", "Website chat"],
    technology: ["Reminder automation", "AI assistant", "CRM"],
    results: ["Fewer missed appointments", "Routine enquiries handled without staff involvement", "More organic visits to priority services"],
    metrics: [
      { label: "No-show rate", value: "-29%" },
      { label: "Staff hours saved", value: "9/wk" },
      { label: "Organic traffic", value: "+54%" },
    ],
    lessons: ["The most valuable automation is often the least glamorous: a reminder at the right time."],
    services: ["whatsapp-automation", "ai-chatbots", "local-seo"],
    art: { variant: "grid", tone: "ivory" },
  },
  {
    slug: "saas-revenue-attribution",
    verified: false,
    client: "B2B SaaS company",
    industry: "Technology",
    industrySlug: "technology",
    title: "Seeing which channels create revenue — not just leads",
    summary: "Full-funnel attribution from ad click to closed deal, and a budget reallocated on the evidence.",
    challenge: "Demo bookings were inconsistent and the sales team had no visibility into which channels produced pipeline.",
    objective: "Connect marketing spend to pipeline and revenue, and shift budget toward what actually works.",
    strategy: "Unify ad, web and CRM data into one model and review it on a fixed rhythm with marketing and sales together.",
    implementation: [
      "Tracking audit and rebuild across GA4, ads and CRM",
      "Data pipeline joining spend, leads, opportunities and closed revenue",
      "Executive and channel dashboards",
      "Funnel fixes between demo request and demo held",
    ],
    channels: ["Google Ads", "LinkedIn", "Organic"],
    technology: ["GA4", "CRM", "BI dashboards", "Data pipelines"],
    results: [
      "Attribution from first click to closed deal",
      "Budget moved to the two highest-performing channels",
      "Better demo-to-close conversion after funnel fixes",
    ],
    metrics: [
      { label: "Pipeline visibility", value: "100%" },
      { label: "Demo-to-close", value: "+18%" },
      { label: "Wasted spend cut", value: "$14k/mo" },
    ],
    lessons: ["Agreeing definitions with sales was harder — and more valuable — than building the dashboard."],
    services: ["analytics", "business-intelligence", "sales-funnels"],
    art: { variant: "grid", tone: "deep" },
  },
];

export const sortedCaseStudies = [...caseStudies].sort((a, b) => Number(b.verified) - Number(a.verified));
export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const hasVerifiedWork = caseStudies.some((c) => c.verified);
