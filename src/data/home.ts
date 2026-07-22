import {
  Target,
  Megaphone,
  MapPin,
  LayoutTemplate,
  TrendingUp,
  Workflow,
  Bot,
  GitBranch,
  Mail,
  BarChart3,
  Search,
  Compass,
  Rocket,
  LineChart,
} from "lucide-react";

export const trustLogos = [
  "Bright Smile Dental",
  "Harlow & Rees Law",
  "Coastline Realty",
  "The Meridian Hotel",
  "Vista Health Clinic",
  "Northgate SaaS",
];

export const differentiators = [
  {
    title: "AI-qualified pipeline",
    description:
      "Every lead is scored and routed before your team sees it, so reps spend time closing, not chasing.",
  },
  {
    title: "Predictable, not lucky",
    description:
      "We build repeatable systems around your offer, not one-off campaigns that stop working when a platform changes.",
  },
  {
    title: "Full-funnel ownership",
    description:
      "Ads, landing pages, CRM, and follow-up live in one system we manage end to end — no finger-pointing between vendors.",
  },
  {
    title: "Numbers you can audit",
    description:
      "A live dashboard shows cost per lead, cost per booked call, and pipeline value — updated in real time.",
  },
];

export const problems = [
  {
    problem: "Leads are unpredictable.",
    agitate:
      "Some months are full, some are dry, and you can't plan hiring or ad spend around a coin flip.",
    solution:
      "We build an always-on acquisition system so pipeline volume stops being a monthly surprise.",
  },
  {
    problem: "Agencies overpromise, then go quiet.",
    agitate:
      "You've paid for 'growth' before and gotten a vanity report with no bookings to show for it.",
    solution:
      "We're paid to produce booked calls, and we show the math behind every one of them.",
  },
  {
    problem: "No visibility into what's actually working.",
    agitate:
      "Spend goes out, leads trickle in, and nobody can tell you which channel or ad is driving revenue.",
    solution:
      "Our dashboard traces every dollar from ad click to booked call, by channel and by campaign.",
  },
];

export const processSteps = [
  {
    title: "Audit & strategy",
    description: "We map your offer, funnel, and market to find the fastest path to booked calls.",
    icon: Search,
  },
  {
    title: "Build the system",
    description: "Landing pages, ad creative, CRM automation, and AI qualification go live together.",
    icon: Workflow,
  },
  {
    title: "Launch & optimize",
    description: "We run daily optimization cycles against cost-per-booked-call, not vanity metrics.",
    icon: Rocket,
  },
  {
    title: "Scale what works",
    description: "Once a channel proves out, we scale spend and expand into the next one.",
    icon: LineChart,
  },
];

export const servicesPreview = [
  { title: "Lead Generation", description: "Full-funnel systems built around booked calls, not clicks.", icon: Target, anchor: "lead-generation" },
  { title: "Google Ads", description: "High-intent search campaigns tuned for cost-per-booked-call.", icon: Megaphone, anchor: "google-ads" },
  { title: "Meta Ads", description: "Scroll-stopping creative paired with tight audience targeting.", icon: Compass, anchor: "meta-ads" },
  { title: "Local SEO", description: "Own the map pack and organic results in your service area.", icon: MapPin, anchor: "local-seo" },
  { title: "Landing Pages", description: "Conversion-tested pages built to turn clicks into calls.", icon: LayoutTemplate, anchor: "landing-pages" },
  { title: "CRO", description: "Ongoing testing that compounds your conversion rate over time.", icon: TrendingUp, anchor: "cro" },
  { title: "CRM Automation", description: "Every lead followed up in seconds, every time, automatically.", icon: GitBranch, anchor: "crm-automation" },
  { title: "AI Chatbots", description: "Instant, human-quality replies that qualify leads around the clock.", icon: Bot, anchor: "ai-chatbots" },
  { title: "Email Marketing", description: "Nurture sequences that turn cold leads into booked calls.", icon: Mail, anchor: "email-marketing" },
  { title: "Analytics & BI", description: "One dashboard tracing every dollar from click to closed deal.", icon: BarChart3, anchor: "analytics" },
];

export const aiAdvantage = [
  {
    title: "Instant lead qualification",
    description: "AI reviews every inbound lead in seconds and flags who's ready to book now.",
  },
  {
    title: "24/7 response speed",
    description: "Leads get a reply in under a minute, day or night — the single biggest lever on close rate.",
  },
  {
    title: "Self-optimizing campaigns",
    description: "Ad spend shifts toward what's converting daily, not whenever someone checks a dashboard.",
  },
];

export const caseStudiesPreview = [
  { industry: "Dental Clinic", metric: "3.4x", result: "increase in booked consultations within 90 days", slug: "dental-clinic" },
  { industry: "Real Estate Agency", metric: "-42%", result: "reduction in cost per qualified buyer lead", slug: "real-estate-agency" },
  { industry: "Law Firm", metric: "212", result: "new client consultations booked in 6 months", slug: "law-firm" },
];

export const testimonials = [
  {
    quote: "We stopped guessing. Every month we know exactly how many calls are booked and what they cost us.",
    name: "Practice Owner",
    role: "Dental Clinic, Toronto",
  },
  {
    quote: "The AI follow-up alone paid for the entire program — leads used to sit for hours before anyone called them back.",
    name: "Managing Partner",
    role: "Law Firm, Dubai",
  },
  {
    quote: "First agency that's shown us the actual math behind our cost per lead instead of a vanity report.",
    name: "Marketing Director",
    role: "Boutique Hotel Group",
  },
];

export const industries = [
  "Dentists",
  "Doctors & Clinics",
  "Law Firms",
  "Real Estate",
  "Hotels",
  "Restaurants",
  "SaaS Companies",
  "Local Services",
];

export const numbers = [
  { value: 4200, suffix: "+", label: "Qualified leads delivered" },
  { value: 38, suffix: "%", label: "Avg. drop in cost per lead" },
  { value: 60, prefix: "<", suffix: "s", label: "Avg. AI response time" },
  { value: 96, suffix: "%", label: "Client retention rate" },
];

export const faqs = [
  {
    question: "How fast will we start seeing leads?",
    answer:
      "Most clients see qualified leads within the first 2–3 weeks of launch, once campaigns and landing pages are live and the AI qualification layer is tuned to your offer.",
  },
  {
    question: "Do you work with our existing CRM?",
    answer:
      "Yes. We integrate with most major CRMs, or set one up for you if you don't already have one — either way, every lead and its full history lives in one place.",
  },
  {
    question: "What makes this different from a normal marketing agency?",
    answer:
      "We're not paid to produce impressions or clicks. Our systems are built and measured around one outcome: booked calls, with full visibility into cost per booked call by channel.",
  },
  {
    question: "Is there a minimum contract length?",
    answer:
      "We recommend a 90-day initial period, since that's typically how long it takes to gather enough data to optimize properly — but we don't lock clients into long-term contracts beyond that.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "We specialize in local and service businesses with a clear booked-call outcome: dental and medical practices, law firms, real estate, hospitality, and service-based SaaS.",
  },
];
