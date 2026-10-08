import type { PillarSlug } from "./services";

export interface GrowthStage {
  index: string;
  name: string;
  verb: string;
  description: string;
  capabilities: string[];
  pillar: PillarSlug;
  question: string;
}

/** The Springs 360 Growth System — the journey every engagement is designed around. */
export const growthStages: GrowthStage[] = [
  {
    index: "01",
    name: "Attract",
    verb: "Earn attention from the right people",
    description:
      "Reach the customers most likely to buy — with paid media, search, social and content that each have a defined role in the journey.",
    capabilities: ["Paid media", "SEO", "Social", "Content"],
    pillar: "performance",
    question: "Are we reaching the people who will actually buy?",
  },
  {
    index: "02",
    name: "Capture",
    verb: "Turn interest into a conversation",
    description:
      "Websites, landing pages and offers designed around how your customers decide, so attention becomes an enquiry, a booking or a sale.",
    capabilities: ["Websites", "Landing pages", "Offers", "CRO"],
    pillar: "digital-experience",
    question: "When they arrive, is the next step obvious and worth taking?",
  },
  {
    index: "03",
    name: "Nurture",
    verb: "Stay relevant until they are ready",
    description:
      "CRM, email, WhatsApp and AI assistants that respond instantly, answer questions and keep you present through the buying cycle.",
    capabilities: ["CRM", "Email", "WhatsApp", "AI"],
    pillar: "ai-automation",
    question: "What happens to the leads who are not ready today?",
  },
  {
    index: "04",
    name: "Convert",
    verb: "Make buying the easy part",
    description:
      "Funnels, qualification and sales automation that route the right prospects to the right people with full context — and follow up every time.",
    capabilities: ["Funnels", "Automation", "Sales systems", "Lead qualification"],
    pillar: "ai-automation",
    question: "Are sales conversations happening with the right people, fast enough?",
  },
  {
    index: "05",
    name: "Retain",
    verb: "Grow the value of every customer",
    description:
      "Analytics, remarketing and customer experience work that turns first purchases into repeat business — and shows what to improve next.",
    capabilities: ["Analytics", "Remarketing", "Customer experience", "Growth optimisation"],
    pillar: "data-intelligence",
    question: "Do customers come back, and do we know why?",
  },
];
