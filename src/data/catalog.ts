import {
  BarChart3,
  Bot,
  Clapperboard,
  Compass,
  Gauge,
  Handshake,
  Inbox,
  LayoutTemplate,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  MessagesSquare,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  PartyPopper,
  PenLine,
  PieChart,
  Search,
  ShoppingBag,
  UserPlus,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * The service menu in the words customers use. This order is the order
 * services are presented on the site — familiar services first, strategic
 * and technical ones after.
 */
export interface CatalogItem {
  slug: string; // service detail page
  label: string;
  outcome: string;
  icon: LucideIcon;
  stage: StageKey;
  top?: boolean; // shown on the home page
}

export type StageKey = "seen" | "customers" | "close" | "grow";

export const stages: { key: StageKey; title: string; text: string }[] = [
  { key: "seen", title: "Get seen", text: "Content, social media and a brand people remember." },
  { key: "customers", title: "Get customers", text: "Ads, websites and promotions that bring enquiries." },
  { key: "close", title: "Close the sale", text: "Fast follow-up, organised leads and closing support." },
  { key: "grow", title: "Grow what works", text: "Performance, analysis and the strategy to scale." },
];

export const catalog: CatalogItem[] = [
  { slug: "social-media-management", label: "Social Media Management & Automation", outcome: "Consistent posts, quick replies and automated DMs.", icon: MessagesSquare, stage: "seen", top: true },
  { slug: "meta-ads", label: "Meta Ads", outcome: "Facebook & Instagram ads that bring real enquiries.", icon: Megaphone, stage: "customers", top: true },
  { slug: "google-ads", label: "Google Ads", outcome: "Show up when customers search for what you sell.", icon: Search, stage: "customers", top: true },
  { slug: "website-development", label: "Website Development", outcome: "Fast, beautiful websites built to convert visitors.", icon: MonitorSmartphone, stage: "customers", top: true },
  { slug: "content-marketing", label: "Content Marketing", outcome: "Articles, guides and videos that attract buyers.", icon: PenLine, stage: "seen", top: true },
  { slug: "branding", label: "Content & Branding", outcome: "A recognisable look, voice and message.", icon: Palette, stage: "seen", top: true },
  { slug: "graphic-design-video", label: "Graphic Design & Video Editing", outcome: "Scroll-stopping visuals, reels and ad creatives.", icon: Clapperboard, stage: "seen", top: true },
  { slug: "promotions", label: "Product & Event Promotions", outcome: "Launches, offers and events that fill up.", icon: PartyPopper, stage: "customers", top: true },
  { slug: "google-business-profile", label: "Google Business Profile Management", outcome: "Get found on Google Maps and get more calls.", icon: MapPin, stage: "seen", top: true },
  { slug: "lead-generation", label: "Client Acquisition", outcome: "A steady flow of qualified new customers.", icon: UserPlus, stage: "customers", top: true },
  { slug: "crm-automation", label: "Leads Management", outcome: "Every enquiry captured, assigned and followed up.", icon: Inbox, stage: "close", top: true },
  { slug: "sales-funnels", label: "Closing", outcome: "Booking, reminders and follow-ups that win the sale.", icon: Handshake, stage: "close", top: true },
  { slug: "performance-management", label: "Performance", outcome: "Campaigns tuned weekly so budget goes where it works.", icon: Gauge, stage: "grow" },
  { slug: "analytics", label: "Analysis & Reporting", outcome: "Clear numbers on what brings customers.", icon: BarChart3, stage: "grow" },
  { slug: "whatsapp-automation", label: "WhatsApp Automation", outcome: "Instant replies on the app your customers use.", icon: MessageCircle, stage: "close" },
  { slug: "ai-chatbots", label: "AI Chatbots", outcome: "Answer and qualify enquiries 24/7.", icon: Bot, stage: "close" },
  { slug: "email-marketing", label: "Email & Lead Nurturing", outcome: "Stay in touch until they're ready to buy.", icon: Mail, stage: "close" },
  { slug: "local-seo", label: "SEO", outcome: "Rank on Google for the searches that matter.", icon: Compass, stage: "seen" },
  { slug: "landing-pages", label: "Landing Pages", outcome: "Focused pages that turn ad clicks into leads.", icon: LayoutTemplate, stage: "customers" },
  { slug: "ecommerce", label: "Ecommerce", outcome: "Online stores that sell — on Shopify and more.", icon: ShoppingBag, stage: "customers" },
  { slug: "cro", label: "Conversion Optimisation", outcome: "More enquiries from the traffic you already have.", icon: MousePointerClick, stage: "grow" },
  { slug: "marketing-automation", label: "Marketing Automation", outcome: "Tools connected, repetitive work removed.", icon: Workflow, stage: "grow" },
  { slug: "business-intelligence", label: "BI Dashboards", outcome: "One dashboard from ad spend to revenue.", icon: PieChart, stage: "grow" },
  { slug: "growth-strategy", label: "Growth Strategy", outcome: "A clear plan for where growth will come from.", icon: Compass, stage: "grow" },
];

export const topServices = catalog.filter((c) => c.top);
