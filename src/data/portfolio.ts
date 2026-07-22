export interface CaseStudy {
  slug: string;
  industry: string;
  title: string;
  challenge: string;
  solutionSummary: string;
  results: string[];
  metrics: { label: string; value: string }[];
  technologies: string[];
  quote: string;
  clientName: string;
  clientRole: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "dental-clinic",
    industry: "Dentists",
    title: "Bright Smile Dental",
    challenge: "Relied almost entirely on referrals, with no predictable way to fill open appointment slots each month.",
    solutionSummary: "Launched Google Ads, a dedicated landing page, and AI chatbot booking to capture and qualify new-patient inquiries automatically.",
    results: [
      "Consultation bookings increased 3.4x within 90 days",
      "Cost per booked consultation dropped by a third",
      "After-hours inquiries now convert via AI chatbot booking",
    ],
    metrics: [
      { label: "Booked Consultations", value: "+240%" },
      { label: "Cost per Booking", value: "-31%" },
      { label: "Response Time", value: "<1 min" },
    ],
    technologies: ["Google Ads", "Landing Pages", "AI Chatbot", "CRM Automation"],
    quote: "We stopped guessing. Every month we know exactly how many calls are booked and what they cost us.",
    clientName: "Practice Owner",
    clientRole: "Bright Smile Dental, Toronto",
  },
  {
    slug: "real-estate-agency",
    industry: "Real Estate",
    title: "Coastline Realty",
    challenge: "Buyer leads from paid social were low quality, flooding agents with unqualified inquiries and wasting their time.",
    solutionSummary: "Rebuilt targeting and creative on Meta Ads, added an AI qualification layer, and routed only sales-ready leads to agents.",
    results: [
      "Qualified buyer lead volume grew while spend stayed flat",
      "Agent time spent on unqualified leads dropped sharply",
      "Cost per qualified buyer lead fell by 42%",
    ],
    metrics: [
      { label: "Cost per Lead", value: "-42%" },
      { label: "Lead Quality Score", value: "+58%" },
      { label: "Agent Hours Saved", value: "12/wk" },
    ],
    technologies: ["Meta Ads", "AI Chatbot", "CRM Automation", "Analytics"],
    quote: "First time our agents are only talking to people who are actually ready to buy.",
    clientName: "Broker Owner",
    clientRole: "Coastline Realty",
  },
  {
    slug: "law-firm",
    industry: "Law Firms",
    title: "Harlow & Rees Law",
    challenge: "New client consultations depended on slow, inconsistent word-of-mouth referrals with no marketing system in place.",
    solutionSummary: "Built a full-funnel system combining Google Ads, local SEO, and automated intake to capture and book consultations directly.",
    results: [
      "212 new client consultations booked in 6 months",
      "Local search visibility improved across priority practice areas",
      "Intake time from inquiry to booked consult cut to minutes",
    ],
    metrics: [
      { label: "Consultations Booked", value: "212" },
      { label: "Local Rankings", value: "Top 3" },
      { label: "Intake Time", value: "-85%" },
    ],
    technologies: ["Google Ads", "Local SEO", "CRM Automation", "Landing Pages"],
    quote: "The AI follow-up alone paid for the entire program — leads used to sit for hours before anyone called them back.",
    clientName: "Managing Partner",
    clientRole: "Harlow & Rees Law, Dubai",
  },
  {
    slug: "boutique-hotel",
    industry: "Hotels",
    title: "The Meridian Hotel",
    challenge: "Direct bookings were being lost to third-party travel platforms, cutting into margin on every stay.",
    solutionSummary: "Ran Meta and Google campaigns driving directly to a conversion-optimized booking page, backed by email nurture for past guests.",
    results: [
      "Direct booking share increased meaningfully quarter over quarter",
      "Email nurture reactivated a large share of past guests",
      "Booking page conversion rate improved through ongoing CRO",
    ],
    metrics: [
      { label: "Direct Bookings", value: "+67%" },
      { label: "Page Conversion", value: "+2.1x" },
      { label: "Repeat Guest Rate", value: "+24%" },
    ],
    technologies: ["Meta Ads", "Google Ads", "CRO", "Email Marketing"],
    quote: "Booking.com used to get most of our business. Now direct bookings are our fastest-growing channel.",
    clientName: "General Manager",
    clientRole: "The Meridian Hotel",
  },
  {
    slug: "vista-health-clinic",
    industry: "Clinics",
    title: "Vista Health Clinic",
    challenge: "Appointment no-shows and slow follow-up were leaving the schedule with unfilled gaps every week.",
    solutionSummary: "Deployed automated appointment reminders, AI chatbot triage for inbound questions, and a local SEO push for priority services.",
    results: [
      "No-show rate dropped after automated reminder sequences went live",
      "Inbound inquiries now triaged and booked without staff involvement",
      "Local search traffic grew for priority service pages",
    ],
    metrics: [
      { label: "No-Show Rate", value: "-29%" },
      { label: "Staff Hours Saved", value: "9/wk" },
      { label: "Organic Traffic", value: "+54%" },
    ],
    technologies: ["Local SEO", "AI Chatbot", "CRM Automation", "Email Marketing"],
    quote: "Our front desk isn't drowning in phone calls anymore. The system handles the routine stuff.",
    clientName: "Clinic Director",
    clientRole: "Vista Health Clinic",
  },
  {
    slug: "northgate-saas",
    industry: "SaaS Companies",
    title: "Northgate SaaS",
    challenge: "Demo bookings were inconsistent and the sales team had no visibility into which channels actually produced pipeline.",
    solutionSummary: "Built a business intelligence dashboard tracing every lead from ad click through demo booking to closed-won revenue.",
    results: [
      "Full attribution from first click to closed deal, for the first time",
      "Budget reallocated toward the two highest-performing channels",
      "Demo-to-close rate improved after funnel fixes",
    ],
    metrics: [
      { label: "Pipeline Visibility", value: "100%" },
      { label: "Demo-to-Close", value: "+18%" },
      { label: "Wasted Spend Cut", value: "$14k/mo" },
    ],
    technologies: ["Business Intelligence", "Analytics", "Sales Funnels", "Google Ads"],
    quote: "For the first time we can actually see which channel is driving revenue, not just leads.",
    clientName: "Head of Growth",
    clientRole: "Northgate SaaS",
  },
];

export const industryFilters = ["All", ...Array.from(new Set(caseStudies.map((c) => c.industry)))];
