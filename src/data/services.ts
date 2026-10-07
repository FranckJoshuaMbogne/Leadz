import type { ArtVariant } from "@/components/art/CoverArt";

/* ================================================================== */
/* Strategic pillars                                                   */
/* ================================================================== */

export type PillarSlug = "strategy" | "performance" | "digital-experience" | "ai-automation" | "data-intelligence";

export interface Pillar {
  slug: PillarSlug;
  index: string;
  name: string;
  headline: string;
  summary: string;
  problem: string;
  approach: { title: string; text: string }[];
  services: { name: string; slug?: string }[];
  measures: string[];
  art: ArtVariant;
  cta: string;
  faqs: { question: string; answer: string }[];
}

export const pillars: Pillar[] = [
  {
    slug: "strategy",
    index: "01",
    name: "Strategy",
    headline: "Decide where growth will come from before spending to chase it.",
    summary:
      "Market, customer and offer work that gives every channel a clear job — so budgets follow a plan instead of the loudest platform.",
    problem:
      "Most marketing budgets are allocated by habit: last year's channels, a competitor's tactics, or whichever platform a vendor sells. Without a defined customer, a sharp offer and a clear path from first touch to purchase, even well-run campaigns struggle to compound.",
    approach: [
      { title: "Diagnose", text: "We audit your market, customers, offer, funnel and current numbers to find where growth is being lost." },
      { title: "Design", text: "We map the customer journey and decide which channels, messages and systems belong at each stage." },
      { title: "Plan", text: "You get a sequenced growth plan with budgets, owners, milestones and the metrics each stage is accountable for." },
    ],
    services: [
      { name: "Growth strategy", slug: "growth-strategy" },
      { name: "Market research" },
      { name: "Customer journey mapping" },
      { name: "Offer strategy" },
      { name: "Marketing planning" },
    ],
    measures: ["Customer acquisition cost targets", "Funnel conversion benchmarks", "Channel mix and budget allocation", "Payback period"],
    art: "contour",
    cta: "Plan your growth",
    faqs: [
      {
        question: "Do we need a strategy engagement before running campaigns?",
        answer:
          "Not always. If your offer, audience and economics are already clear, we can start with execution and fold strategy into the first month. If they are not, a short strategy phase usually saves more budget than it costs.",
      },
      {
        question: "What do we receive at the end of a strategy engagement?",
        answer:
          "A written growth plan: target customers and positioning, the customer journey, channel roles, budget allocation, a 90-day roadmap and the KPIs each stage is measured against.",
      },
    ],
  },
  {
    slug: "performance",
    index: "02",
    name: "Performance",
    headline: "Paid and organic acquisition, managed against revenue — not clicks.",
    summary:
      "Google, Meta, SEO and retargeting run as one acquisition engine, optimised for qualified leads, sales and cost per customer.",
    problem:
      "Ad platforms optimise for what they can see. When conversion tracking stops at a form fill, campaigns learn to buy cheap leads that never become customers, and reports look healthy while the sales team stays hungry.",
    approach: [
      { title: "Instrument", text: "Clean conversion tracking that reaches beyond the form — to qualified lead, booked meeting or sale." },
      { title: "Launch", text: "Search, social and local campaigns with tight structure, intent-led keywords and creative built around your offer." },
      { title: "Compound", text: "Weekly optimisation against cost per qualified lead and cost per customer, with budget moved to what works." },
    ],
    services: [
      { name: "Google Ads", slug: "google-ads" },
      { name: "Meta Ads", slug: "meta-ads" },
      { name: "Lead generation systems", slug: "lead-generation" },
      { name: "SEO & local SEO", slug: "local-seo" },
      { name: "Retargeting" },
    ],
    measures: ["Cost per qualified lead", "Cost per acquisition", "Return on ad spend", "Share of organic and local search"],
    art: "flow",
    cta: "Find your growth opportunity",
    faqs: [
      {
        question: "Is ad spend included in your fees?",
        answer:
          "No. Media budgets are paid directly to Google, Meta or other platforms from your own accounts, so you always own the accounts and the data. Our management fee is quoted separately.",
      },
      {
        question: "How long before paid campaigns perform?",
        answer:
          "Search campaigns usually produce useful data within the first few weeks. Platforms need conversion volume to optimise well, so expect a learning period before performance stabilises; SEO compounds over months rather than weeks.",
      },
    ],
  },
  {
    slug: "digital-experience",
    index: "03",
    name: "Digital Experience",
    headline: "Websites and landing pages built to turn attention into action.",
    summary:
      "Fast, considered websites, landing pages and ecommerce experiences — designed around how your customers decide, then improved through testing.",
    problem:
      "Traffic is expensive and attention is short. A slow page, a vague offer or a form that asks too much quietly wastes the budget spent to bring people there — and most teams never see where visitors drop off.",
    approach: [
      { title: "Understand", text: "Research the decisions and objections your buyers have, and the evidence they need to act." },
      { title: "Build", text: "Design and develop fast, accessible pages with a clear hierarchy, strong proof and one obvious next step." },
      { title: "Optimise", text: "Measure behaviour, test changes that matter and roll winners into the core experience." },
    ],
    services: [
      { name: "Website design & development", slug: "website-development" },
      { name: "Landing pages", slug: "landing-pages" },
      { name: "Ecommerce", slug: "ecommerce" },
      { name: "Conversion rate optimisation", slug: "cro" },
      { name: "UX design" },
    ],
    measures: ["Conversion rate by traffic source", "Page speed and Core Web Vitals", "Form completion rate", "Revenue per visitor"],
    art: "grid",
    cta: "Improve your conversion",
    faqs: [
      {
        question: "Which platforms do you build on?",
        answer:
          "We choose the platform for the job — custom React builds for performance-critical marketing sites, Shopify for ecommerce, and established CMS platforms where your team needs to edit content independently.",
      },
      {
        question: "Can you improve our existing site instead of rebuilding it?",
        answer:
          "Often, yes. A conversion audit frequently finds high-impact fixes — speed, messaging, forms, page structure — that can be shipped long before a full rebuild is justified.",
      },
    ],
  },
  {
    slug: "ai-automation",
    index: "04",
    name: "AI & Automation",
    headline: "Respond in minutes, follow up every time, and let people focus on selling.",
    summary:
      "CRM, WhatsApp, email and AI assistants connected so that every lead is captured, qualified, nurtured and routed without manual chasing.",
    problem:
      "Most businesses lose more leads after acquisition than before it. Enquiries sit unanswered, follow-up depends on memory, and sales teams spend their best hours on people who were never going to buy.",
    approach: [
      { title: "Map", text: "Document how leads arrive, who handles them and where they stall between enquiry and sale." },
      { title: "Connect", text: "Set up the CRM as the single source of truth and connect forms, ads, WhatsApp, email and calendars to it." },
      { title: "Automate", text: "Add instant responses, AI-assisted qualification, nurture sequences and routing rules — with humans in the loop where it matters." },
    ],
    services: [
      { name: "CRM setup & automation", slug: "crm-automation" },
      { name: "WhatsApp automation", slug: "whatsapp-automation" },
      { name: "AI chatbots & assistants", slug: "ai-chatbots" },
      { name: "Lead nurturing & email", slug: "email-marketing" },
      { name: "Marketing automation", slug: "marketing-automation" },
      { name: "Sales funnels & automation", slug: "sales-funnels" },
    ],
    measures: ["Speed to first response", "Lead-to-meeting rate", "Pipeline velocity", "Hours of manual work removed"],
    art: "orbit",
    cta: "Automate your follow-up",
    faqs: [
      {
        question: "Will AI replace our sales team's conversations?",
        answer:
          "No. We use AI for what it does well — answering common questions instantly, collecting qualifying information and summarising context — and hand qualified conversations to people. You control what the assistant can and cannot say.",
      },
      {
        question: "Which CRM do you work with?",
        answer:
          "We work with widely used CRMs such as HubSpot, Zoho and similar platforms, and recommend based on your team size, budget and the integrations you need.",
      },
    ],
  },
  {
    slug: "data-intelligence",
    index: "05",
    name: "Data & Intelligence",
    headline: "One honest view of what marketing returns.",
    summary:
      "Analytics, attribution and dashboards that connect spend to pipeline and revenue — so decisions are made on evidence, not platform reports.",
    problem:
      "Every platform claims credit for the same sale. Spreadsheets disagree, reports arrive late, and leadership cannot tell which investment is actually driving growth.",
    approach: [
      { title: "Audit", text: "Review tracking, data sources and definitions; fix what is broken and agree what each metric means." },
      { title: "Unify", text: "Bring ad, website, CRM and sales data into one model with consistent attribution rules." },
      { title: "Decide", text: "Dashboards and a reporting rhythm that turn numbers into budget, creative and sales decisions." },
    ],
    services: [
      { name: "Analytics & tracking", slug: "analytics" },
      { name: "Attribution" },
      { name: "BI dashboards", slug: "business-intelligence" },
      { name: "Reporting" },
      { name: "Performance optimisation" },
    ],
    measures: ["Marketing ROI by channel", "Cost per customer", "Customer lifetime value", "Forecast accuracy"],
    art: "rings",
    cta: "See what's working",
    faqs: [
      {
        question: "Which tools do you use for analytics and dashboards?",
        answer:
          "Typically Google Analytics 4, Google Tag Manager and server-side tagging where appropriate, with dashboards in Looker Studio or a BI tool your team already uses. The goal is a setup your team can maintain.",
      },
      {
        question: "Can you measure offline sales and phone calls?",
        answer:
          "Yes, where the data exists. Calls can be tracked with call tracking, and offline sales recorded in a CRM can be fed back to analytics and ad platforms to close the loop.",
      },
    ],
  },
];

/* ================================================================== */
/* Individual services                                                 */
/* ================================================================== */

export interface Service {
  slug: string;
  pillar: PillarSlug;
  name: string;
  short: string;
  intro: string;
  problem: string;
  approach: { title: string; text: string }[];
  deliverables: string[];
  measures: string[];
  fit: string;
  related: string[];
}

export const services: Service[] = [
  {
    slug: "growth-strategy",
    pillar: "strategy",
    name: "Growth Strategy",
    short: "A sequenced plan for where growth will come from — and what it should cost.",
    intro:
      "We define who you should win, what you should offer them, and how marketing, sales and technology work together to get there.",
    problem:
      "Without a shared plan, teams optimise their own channel and the business optimises nothing. Budgets drift, messages conflict, and no one can say what a customer should cost.",
    approach: [
      { title: "Discovery", text: "Interviews, data review and market research to understand customers, competitors and unit economics." },
      { title: "Positioning & offer", text: "Clarify who you serve, why they should choose you and the offer that makes the first step easy." },
      { title: "Journey & channels", text: "Map the path from first touch to repeat purchase and assign each channel a clear role." },
      { title: "Roadmap", text: "Prioritise initiatives into a 90-day plan with budgets, owners and KPIs." },
    ],
    deliverables: ["Customer and market insight summary", "Positioning and offer recommendations", "Customer journey map", "Channel and budget plan", "90-day roadmap with KPIs"],
    measures: ["Target CAC and payback", "Stage-by-stage conversion benchmarks", "Pipeline and revenue targets"],
    fit: "Businesses entering a new market, launching a new offer, or spending meaningfully on marketing without a clear plan.",
    related: ["analytics", "lead-generation", "website-development"],
  },
  {
    slug: "lead-generation",
    pillar: "performance",
    name: "Lead Generation Systems",
    short: "A consistent flow of qualified enquiries, built as a system rather than a campaign.",
    intro:
      "We combine targeting, offer, landing experience and follow-up into one system engineered for a steady volume of qualified leads.",
    problem:
      "Referrals and one-off campaigns create feast-or-famine months. When ads, pages and follow-up are run separately, nobody owns the number that matters: qualified conversations.",
    approach: [
      { title: "Offer & audience", text: "Define the ideal customer and a reason to enquire now." },
      { title: "Acquisition", text: "Launch the channels most likely to reach that audience efficiently — typically search and paid social." },
      { title: "Conversion", text: "Purpose-built landing pages and forms that qualify without adding friction." },
      { title: "Follow-up", text: "Instant response, CRM routing and nurture so no enquiry goes cold." },
    ],
    deliverables: ["Campaign architecture and creative", "Dedicated landing pages", "CRM pipeline and automations", "Lead quality feedback loop", "Weekly performance reporting"],
    measures: ["Qualified leads per week", "Cost per qualified lead", "Lead-to-meeting rate"],
    fit: "Service businesses with a defined offer and the capacity to follow up on new enquiries quickly.",
    related: ["google-ads", "landing-pages", "crm-automation"],
  },
  {
    slug: "google-ads",
    pillar: "performance",
    name: "Google Ads",
    short: "Search, Performance Max and YouTube campaigns tuned for qualified demand.",
    intro: "We capture people already searching for what you sell, and structure campaigns so spend goes to the searches that turn into customers.",
    problem:
      "Broad match, auto-applied recommendations and form-fill conversion goals can quietly push budget toward low-intent traffic. The account looks busy; the pipeline does not.",
    approach: [
      { title: "Audit & tracking", text: "Fix conversion tracking and import downstream outcomes such as qualified leads or sales." },
      { title: "Structure", text: "Intent-led campaign and keyword architecture with tight negatives." },
      { title: "Creative & pages", text: "Ad copy and landing pages that match the search and the offer." },
      { title: "Optimise", text: "Bidding, budget and query management against cost per qualified outcome." },
    ],
    deliverables: ["Account audit", "Conversion tracking setup", "Campaign build or restructure", "Landing page recommendations", "Monthly performance review"],
    measures: ["Cost per qualified lead or sale", "Search impression share on core terms", "Return on ad spend"],
    fit: "Businesses whose customers search for the product or service before buying.",
    related: ["landing-pages", "analytics", "meta-ads"],
  },
  {
    slug: "meta-ads",
    pillar: "performance",
    name: "Meta Ads",
    short: "Facebook and Instagram campaigns that create demand and capture it efficiently.",
    intro: "We pair creative built for the feed with audience and conversion strategy, so social spend produces customers rather than cheap form fills.",
    problem:
      "Meta's algorithm optimises toward whatever signal it receives. If that signal is a low-friction lead form, it will find people who fill forms — not necessarily people who buy.",
    approach: [
      { title: "Signal quality", text: "Pixel and Conversions API setup, with qualified-lead or purchase events where possible." },
      { title: "Creative system", text: "A steady pipeline of concepts and formats tested against clear hypotheses." },
      { title: "Funnel structure", text: "Prospecting, retargeting and retention audiences with distinct messages." },
      { title: "Optimise", text: "Budget and creative decisions based on downstream results, not CTR." },
    ],
    deliverables: ["Pixel and Conversions API setup", "Creative strategy and production briefs", "Campaign build", "Testing roadmap", "Monthly performance review"],
    measures: ["Cost per qualified lead or purchase", "Creative hit rate", "Blended customer acquisition cost"],
    fit: "Brands with a visual product or a clearly defined audience that can be reached through interests and lookalikes.",
    related: ["google-ads", "landing-pages", "ecommerce"],
  },
  {
    slug: "local-seo",
    pillar: "performance",
    name: "SEO & Local SEO",
    short: "Durable visibility in search results and Google Maps for the queries that matter.",
    intro: "We improve how search engines understand, trust and rank your business — from technical foundations to content and local presence.",
    problem:
      "Organic and local search often drive the highest-intent visits a business receives, but slow sites, thin pages and inconsistent business listings leave that demand to competitors.",
    approach: [
      { title: "Technical", text: "Crawlability, site speed, structured data and indexation fixed first." },
      { title: "Local presence", text: "Google Business Profile optimisation, consistent citations and a review strategy." },
      { title: "Content", text: "Service, location and insight pages that answer what buyers actually search for." },
      { title: "Authority", text: "Earn relevant links and mentions through useful content and partnerships." },
    ],
    deliverables: ["Technical SEO audit", "Keyword and content plan", "Google Business Profile optimisation", "On-page improvements", "Monthly visibility reporting"],
    measures: ["Organic and map-pack visibility for priority terms", "Organic leads and revenue", "Indexed, ranking pages"],
    fit: "Businesses with a service area or a product category people research online.",
    related: ["website-development", "analytics", "google-ads"],
  },
  {
    slug: "website-development",
    pillar: "digital-experience",
    name: "Website Design & Development",
    short: "Fast, editorial, conversion-led websites that your team can run.",
    intro: "We design and build websites that explain clearly, load quickly and guide visitors to the next step — on every screen size.",
    problem:
      "Many business websites are brochures: slow, generic and disconnected from the CRM. They rarely make the case for the business or capture the demand marketing creates.",
    approach: [
      { title: "Architecture", text: "Sitemap, page goals and content structure built around buyer questions." },
      { title: "Design", text: "A distinctive visual system with accessibility and performance designed in." },
      { title: "Development", text: "Modern, maintainable builds with SEO foundations, analytics and CRM integration." },
      { title: "Launch & iterate", text: "Redirect planning, QA, launch and post-launch optimisation." },
    ],
    deliverables: ["Sitemap and content plan", "Design system and page designs", "Responsive development", "SEO and analytics setup", "CRM and form integration"],
    measures: ["Conversion rate", "Core Web Vitals", "Organic traffic", "Lead quality from the site"],
    fit: "Businesses whose website no longer reflects the quality of what they sell, or cannot support their growth plans.",
    related: ["landing-pages", "cro", "local-seo"],
  },
  {
    slug: "landing-pages",
    pillar: "digital-experience",
    name: "Landing Pages",
    short: "Focused pages that match the ad, make the offer and earn the click.",
    intro: "Every paid campaign deserves a page built for that audience and that promise — not a link to the homepage.",
    problem:
      "Sending paid traffic to generic pages forces visitors to work out what to do. Each extra decision costs conversions, and with them the efficiency of the whole campaign.",
    approach: [
      { title: "Message match", text: "Headline and offer aligned to the ad and search intent." },
      { title: "Persuasion", text: "Clear benefits, specific proof and answers to the objections that stop people." },
      { title: "Friction", text: "Short, well-designed forms and fast load times on mobile networks." },
      { title: "Testing", text: "Structured tests on the elements most likely to move results." },
    ],
    deliverables: ["Page strategy and copy", "Design and build", "Tracking and CRM connection", "Test plan"],
    measures: ["Landing page conversion rate", "Cost per lead", "Form abandonment"],
    fit: "Any business running paid campaigns or launching a specific offer.",
    related: ["google-ads", "meta-ads", "cro"],
  },
  {
    slug: "ecommerce",
    pillar: "digital-experience",
    name: "Ecommerce",
    short: "Online stores built for discovery, confidence and repeat purchase.",
    intro: "We design and develop ecommerce experiences — often on Shopify — that make products easy to find, easy to trust and easy to buy again.",
    problem:
      "Ecommerce margins are won or lost on conversion rate, average order value and repeat purchase. Slow themes, weak product pages and clumsy checkout erode all three.",
    approach: [
      { title: "Merchandising", text: "Navigation, collections and search shaped around how customers shop." },
      { title: "Product pages", text: "Imagery, detail and proof that answer the questions a shop assistant would." },
      { title: "Performance", text: "Fast themes, clean apps stack and structured data for search." },
      { title: "Retention", text: "Email, WhatsApp and loyalty flows connected from day one." },
    ],
    deliverables: ["Store architecture", "Theme design and development", "Product page templates", "Analytics and feed setup", "Retention flows"],
    measures: ["Conversion rate", "Average order value", "Repeat purchase rate", "Revenue per visitor"],
    fit: "Brands selling online that want their store to match the quality of their product.",
    related: ["meta-ads", "email-marketing", "cro"],
  },
  {
    slug: "cro",
    pillar: "digital-experience",
    name: "Conversion Rate Optimisation",
    short: "Evidence-led improvements that make every visit more valuable.",
    intro: "We find where visitors hesitate or leave, then test changes that remove the reasons.",
    problem:
      "Increasing traffic is the expensive way to grow. Most sites have conversion problems hidden in plain sight — unclear offers, slow pages, confusing forms — that no one has measured.",
    approach: [
      { title: "Research", text: "Analytics, session recordings, heatmaps and customer feedback to locate friction." },
      { title: "Hypotheses", text: "Prioritised ideas based on expected impact and effort." },
      { title: "Experiments", text: "Properly designed tests with enough traffic to trust the outcome." },
      { title: "Roll-out", text: "Winners become the new baseline; learnings feed the next round." },
    ],
    deliverables: ["Conversion audit", "Prioritised test roadmap", "Test design and build", "Results analysis"],
    measures: ["Conversion rate", "Revenue or leads per visitor", "Test win rate"],
    fit: "Sites with steady traffic where small conversion gains are worth a lot.",
    related: ["landing-pages", "analytics", "website-development"],
  },
  {
    slug: "crm-automation",
    pillar: "ai-automation",
    name: "CRM Setup & Automation",
    short: "One place for every lead, with follow-up that happens automatically.",
    intro: "We set up or rebuild your CRM so every enquiry is captured, assigned, followed up and reported on — without spreadsheets.",
    problem:
      "When leads live in inboxes, spreadsheets and WhatsApp chats, follow-up depends on memory. Response times slip, context gets lost and nobody can see the pipeline.",
    approach: [
      { title: "Process", text: "Define pipeline stages, ownership and the rules for moving between them." },
      { title: "Integrate", text: "Connect forms, ads, calls, WhatsApp and calendars to the CRM." },
      { title: "Automate", text: "Assignment, reminders, sequences and alerts based on lead behaviour." },
      { title: "Report", text: "Pipeline dashboards your team actually uses." },
    ],
    deliverables: ["CRM selection or audit", "Pipeline and field design", "Integrations", "Automation workflows", "Team training"],
    measures: ["Speed to lead", "Lead-to-meeting rate", "Pipeline value and velocity"],
    fit: "Teams receiving more enquiries than they can reliably follow up by hand.",
    related: ["whatsapp-automation", "email-marketing", "business-intelligence"],
  },
  {
    slug: "whatsapp-automation",
    pillar: "ai-automation",
    name: "WhatsApp Automation",
    short: "Instant, personal conversations on the channel your customers already use.",
    intro: "We use the WhatsApp Business Platform to respond instantly, qualify enquiries, send reminders and keep customers engaged — connected to your CRM.",
    problem:
      "In many markets customers prefer WhatsApp to email or forms. Handled manually from a single phone, those conversations are slow, unrecorded and impossible to scale.",
    approach: [
      { title: "Setup", text: "WhatsApp Business Platform access, templates and opt-in flows." },
      { title: "Conversation design", text: "Welcome, qualification, FAQ and hand-off flows written for your brand." },
      { title: "Integration", text: "Conversations logged to the CRM and routed to the right person." },
      { title: "Lifecycle", text: "Reminders, follow-ups and re-engagement messages that respect consent." },
    ],
    deliverables: ["Platform setup", "Message templates", "Automated flows", "CRM integration", "Shared team inbox"],
    measures: ["Response time", "Conversation-to-booking rate", "Opt-in and opt-out rates"],
    fit: "Businesses whose customers already reach out on WhatsApp.",
    related: ["ai-chatbots", "crm-automation", "email-marketing"],
  },
  {
    slug: "ai-chatbots",
    pillar: "ai-automation",
    name: "AI Chatbots & Assistants",
    short: "AI that answers, qualifies and books — and knows when to hand over.",
    intro: "We build AI assistants grounded in your own information, for your website and messaging channels, with clear limits and human escalation.",
    problem:
      "Visitors arrive at all hours with the same questions. Without an answer, they leave; with a poorly designed bot, they leave frustrated.",
    approach: [
      { title: "Scope", text: "Decide what the assistant should do — answer, qualify, book — and what it must never do." },
      { title: "Knowledge", text: "Ground responses in approved content about your services, pricing approach and policies." },
      { title: "Hand-off", text: "Route qualified or sensitive conversations to people with full context." },
      { title: "Review", text: "Monitor conversations and improve answers continuously." },
    ],
    deliverables: ["Use-case and guardrail design", "Knowledge base preparation", "Assistant build and integration", "Monitoring and improvement"],
    measures: ["Resolution rate", "Qualified conversations", "Bookings from chat", "Escalation quality"],
    fit: "Businesses with recurring pre-sales questions and enquiries outside working hours.",
    related: ["whatsapp-automation", "crm-automation", "landing-pages"],
  },
  {
    slug: "email-marketing",
    pillar: "ai-automation",
    name: "Lead Nurturing & Email",
    short: "Sequences that keep you relevant until a prospect is ready to buy.",
    intro: "Most buyers are not ready on first contact. We design nurture journeys that educate, build trust and bring them back at the right moment.",
    problem:
      "A lead that is not ready today is often treated as a lost lead. Without nurturing, the cost of acquiring that person is wasted.",
    approach: [
      { title: "Segments", text: "Group leads and customers by intent, stage and interest." },
      { title: "Journeys", text: "Welcome, nurture, re-engagement and post-purchase sequences." },
      { title: "Content", text: "Useful, specific messages — not newsletters for the sake of sending." },
      { title: "Deliverability", text: "Authentication, list hygiene and sending practices that keep you out of spam." },
    ],
    deliverables: ["Lifecycle map", "Email and message sequences", "Templates", "Deliverability setup", "Performance reporting"],
    measures: ["Nurture-to-meeting or purchase rate", "Engagement by segment", "Revenue from lifecycle messaging"],
    fit: "Businesses with longer buying cycles or a meaningful base of past customers.",
    related: ["crm-automation", "marketing-automation", "whatsapp-automation"],
  },
  {
    slug: "marketing-automation",
    pillar: "ai-automation",
    name: "Marketing Automation",
    short: "Connected tools and workflows that remove repetitive work.",
    intro: "We connect your marketing stack so data flows automatically between ads, website, CRM, messaging and reporting.",
    problem:
      "Teams lose hours each week copying data between tools, and the gaps between systems are where leads and insight disappear.",
    approach: [
      { title: "Audit", text: "Map tools, data flows and manual tasks." },
      { title: "Design", text: "Decide what should be automated, and what must stay human." },
      { title: "Build", text: "Native integrations or tools such as Zapier and Make, documented and monitored." },
      { title: "Maintain", text: "Alerts and reviews so automations keep working as tools change." },
    ],
    deliverables: ["Stack and workflow audit", "Automation design", "Integrations", "Documentation"],
    measures: ["Manual hours removed", "Data completeness", "Error rates"],
    fit: "Growing teams whose tools do not talk to each other.",
    related: ["crm-automation", "analytics", "email-marketing"],
  },
  {
    slug: "sales-funnels",
    pillar: "ai-automation",
    name: "Sales Funnels & Automation",
    short: "A clear path from first interest to signed customer.",
    intro: "We design the steps between enquiry and purchase — qualification, booking, proposals, reminders — and automate the parts that slow deals down.",
    problem:
      "Deals stall in the gaps: an unbooked call, a proposal never followed up, a no-show without a reminder. Each gap reduces close rates.",
    approach: [
      { title: "Map", text: "Document each step from enquiry to close and where prospects drop out." },
      { title: "Qualify", text: "Criteria and forms that route the right prospects to the right next step." },
      { title: "Automate", text: "Booking, reminders, proposal follow-ups and no-show recovery." },
      { title: "Measure", text: "Stage conversion and time-in-stage reporting." },
    ],
    deliverables: ["Funnel map", "Qualification logic", "Booking and reminder flows", "Sales dashboard"],
    measures: ["Stage conversion rates", "Show-up rate", "Sales cycle length"],
    fit: "Businesses that sell through calls, consultations or proposals.",
    related: ["crm-automation", "landing-pages", "business-intelligence"],
  },
  {
    slug: "analytics",
    pillar: "data-intelligence",
    name: "Analytics & Tracking",
    short: "Measurement you can trust, from first click to closed revenue.",
    intro: "We set up analytics and conversion tracking properly — so every other decision is made on accurate data.",
    problem:
      "Broken tags, duplicate conversions and missing consent setup quietly corrupt reports and the ad platforms that learn from them.",
    approach: [
      { title: "Audit", text: "Review GA4, tag manager, pixels and CRM data for gaps and errors." },
      { title: "Plan", text: "A measurement plan defining events, conversions and naming." },
      { title: "Implement", text: "Clean implementation, server-side where useful, with consent handled correctly." },
      { title: "Validate", text: "QA and ongoing monitoring so tracking stays accurate." },
    ],
    deliverables: ["Measurement plan", "GA4 and Tag Manager setup", "Conversion tracking for ad platforms", "Data QA"],
    measures: ["Tracking coverage", "Data accuracy against CRM", "Conversion signal quality"],
    fit: "Any business spending on marketing that cannot fully trust its numbers.",
    related: ["business-intelligence", "google-ads", "cro"],
  },
  {
    slug: "business-intelligence",
    pillar: "data-intelligence",
    name: "BI Dashboards & Attribution",
    short: "One dashboard for marketing, pipeline and revenue.",
    intro: "We bring advertising, website, CRM and sales data together so leadership can see what each channel truly contributes.",
    problem:
      "Platform dashboards each claim credit, and spreadsheets take days to reconcile. By the time the numbers agree, the decision window has passed.",
    approach: [
      { title: "Model", text: "Agree definitions and an attribution approach that fits your sales cycle." },
      { title: "Connect", text: "Pipelines from ad platforms, analytics and CRM into one data source." },
      { title: "Visualise", text: "Dashboards designed for the decisions each audience makes." },
      { title: "Operate", text: "A reporting rhythm that turns insight into action." },
    ],
    deliverables: ["KPI framework", "Data pipelines", "Executive and channel dashboards", "Reporting cadence"],
    measures: ["Marketing ROI by channel", "Cost per customer", "Time to insight"],
    fit: "Businesses investing across several channels that need one version of the truth.",
    related: ["analytics", "crm-automation", "growth-strategy"],
  },
];

export const getPillar = (slug: string) => pillars.find((p) => p.slug === slug);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const servicesForPillar = (slug: PillarSlug) => services.filter((s) => s.pillar === slug);
