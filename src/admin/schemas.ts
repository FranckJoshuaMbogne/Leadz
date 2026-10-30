import type { Location } from "@/data/locations";
import type { Field } from "./fields";
import type { CaseStudy, CatalogItem, GrowthStage, Industry, Pillar, Service } from "@/content/types";
import type { Faq } from "@/content/types";
import { iconNames } from "@/lib/icons";

const stageOptions = [
  { value: "seen", label: "Get seen" },
  { value: "customers", label: "Get customers" },
  { value: "close", label: "Close the sale" },
  { value: "grow", label: "Grow what works" },
];
const artOptions = ["contour", "flow", "rings", "grid", "orbit"].map((v) => ({ value: v, label: v }));
const toneOptions = ["forest", "sage", "ivory", "deep"].map((v) => ({ value: v, label: v }));

const steps = (k: string, label: string): Field => ({
  k,
  label,
  type: "list",
  itemTitle: (x) => x.title,
  newItem: () => ({ title: "", text: "" }),
  addLabel: "Add step",
  fields: [
    { k: "title", label: "Title", type: "text" },
    { k: "text", label: "Text", type: "textarea" },
  ],
});
const qa = (k: string, label: string): Field => ({
  k,
  label,
  type: "list",
  itemTitle: (x) => x.question,
  newItem: () => ({ question: "", answer: "" }),
  addLabel: "Add question",
  fields: [
    { k: "question", label: "Question", type: "text" },
    { k: "answer", label: "Answer", type: "textarea" },
  ],
});

export const settingsFields: Field[] = [
  { k: "heroEyebrow", label: "Hero — small line above the title", type: "text" },
  { k: "heroLines", label: "Hero — title lines", type: "slist", hint: "One line each. Wrap words in *asterisks* to colour them gold, e.g. *360°* Digital." },
  { k: "heroSubtitle", label: "Hero — italic subtitle", type: "text" },
  { k: "heroText", label: "Hero — supporting text", type: "textarea" },
  { k: "reassurance", label: "Hero — reassurance ticks", type: "slist" },
  { k: "heroImage", label: "Hero — image (optional)", type: "image", hint: "Replaces the animated cards on desktop. Portrait format works best." },
  { k: "ctaLabel", label: "Main button label", type: "text" },
  { k: "ctaHref", label: "Main button link", type: "text", hint: "/book uses the strategy-call form. You can also paste a Calendly link." },
  { k: "phone", label: "Phone / WhatsApp (international)", type: "text", placeholder: "+918522997932" },
  { k: "phoneDisplay", label: "Phone as displayed", type: "text" },
  { k: "whatsappText", label: "Pre-filled WhatsApp message", type: "textarea" },
  { k: "email", label: "Public email", type: "text", hint: "Leave empty to hide email on the site." },
  { k: "hours", label: "Opening hours", type: "text" },
  { k: "address", label: "Address", type: "textarea", hint: "Leave empty to hide." },
  {
    k: "social",
    label: "Social profiles",
    type: "list",
    itemTitle: (x) => x.label,
    newItem: () => ({ label: "", href: "" }),
    addLabel: "Add profile",
    fields: [
      { k: "label", label: "Label (Instagram, LinkedIn…)", type: "text" },
      { k: "href", label: "URL", type: "url" },
    ],
  },
];

export const catalogFields: Field[] = [
  { k: "label", label: "Service name (as customers say it)", type: "text" },
  { k: "outcome", label: "One-line outcome", type: "text" },
  { k: "slug", label: "Service page", type: "ref", source: "services", hint: "Which detailed service page the card opens." },
  { k: "icon", label: "Icon", type: "select", options: iconNames.map((n) => ({ value: n, label: n })) },
  { k: "stage", label: "Growth wheel step", type: "select", options: stageOptions },
  { k: "top", label: "Most requested (shown on the home page)", type: "bool" },
];
export const newCatalogItem = (): CatalogItem => ({ slug: "", label: "New service", outcome: "", icon: "Sparkles", stage: "customers", top: false });

export const stageFields: Field[] = [
  { k: "title", label: "Title", type: "text" },
  { k: "text", label: "Text", type: "textarea" },
];

export const growthFields: Field[] = [
  { k: "name", label: "Step name", type: "text" },
  { k: "index", label: "Number", type: "text" },
  { k: "key", label: "Services shown in this step", type: "select", options: stageOptions, hint: "Services in “Services menu” with this step appear here." },
  { k: "verb", label: "Headline", type: "text" },
  { k: "description", label: "Description", type: "textarea" },
  { k: "question", label: "Question to ask yourself", type: "text" },
];
export const newGrowth = (): GrowthStage => ({ key: "grow", index: "05", name: "New step", verb: "", description: "", question: "" });

export const pillarFields: Field[] = [
  { k: "name", label: "Capability name", type: "text" },
  { k: "slug", label: "URL slug", type: "text", hint: "/services/<slug>" },
  { k: "index", label: "Number", type: "text" },
  { k: "headline", label: "Headline", type: "textarea" },
  { k: "summary", label: "Summary", type: "textarea" },
  { k: "problem", label: "The problem", type: "textarea" },
  { k: "image", label: "Image (optional)", type: "image" },
  steps("approach", "Approach"),
  {
    k: "services",
    label: "Services listed",
    type: "list",
    itemTitle: (x) => x.name,
    newItem: () => ({ name: "" }),
    addLabel: "Add service",
    fields: [
      { k: "name", label: "Name", type: "text" },
      { k: "slug", label: "Links to service page", type: "ref", source: "services" },
    ],
  },
  { k: "measures", label: "What we measure", type: "slist" },
  { k: "cta", label: "Button label", type: "text" },
  { k: "art", label: "Cover art style", type: "select", options: artOptions },
  qa("faqs", "FAQ"),
];
export const newPillar = (): Pillar => ({ slug: "" as Pillar["slug"], index: "07", name: "New capability", headline: "", summary: "", problem: "", approach: [], services: [], measures: [], art: "flow", cta: "Talk to us", faqs: [] });

export const serviceFields: Field[] = [
  { k: "name", label: "Service name", type: "text" },
  { k: "slug", label: "URL slug", type: "text", hint: "/services/<slug>" },
  { k: "pillar", label: "Capability", type: "ref", source: "pillars" },
  { k: "short", label: "Short description", type: "text" },
  { k: "intro", label: "Introduction", type: "textarea" },
  { k: "problem", label: "The problem", type: "textarea" },
  { k: "image", label: "Image (optional)", type: "image" },
  steps("approach", "How we do it"),
  { k: "deliverables", label: "What you get", type: "slist" },
  { k: "measures", label: "What we measure", type: "slist" },
  { k: "fit", label: "Who it's for", type: "textarea" },
  { k: "related", label: "Related services", type: "refs", source: "services" },
];
export const newService = (): Service => ({ slug: "", pillar: "strategy", name: "New service", short: "", intro: "", problem: "", approach: [], deliverables: [], measures: [], fit: "", related: [] });

export const workFields: Field[] = [
  { k: "client", label: "Client", type: "text" },
  { k: "title", label: "Title", type: "text" },
  { k: "slug", label: "URL slug", type: "text", hint: "/work/<slug>" },
  { k: "published", label: "Published (visible on the site)", type: "bool" },
  { k: "verified", label: "Real client result", type: "bool", hint: "Tick only for real, verifiable work. Unticked items show an “Illustrative” label." },
  { k: "image", label: "Cover image", type: "image" },
  { k: "gallery", label: "Gallery", type: "images" },
  { k: "video", label: "Video link", type: "url", hint: "YouTube, Vimeo, Google Drive or .mp4" },
  { k: "url", label: "Live project link", type: "url" },
  { k: "industry", label: "Industry (label)", type: "text" },
  { k: "industrySlug", label: "Industry page", type: "ref", source: "industries" },
  { k: "summary", label: "Summary", type: "textarea" },
  { k: "challenge", label: "Challenge", type: "textarea" },
  { k: "objective", label: "Objective", type: "textarea" },
  { k: "strategy", label: "Strategy", type: "textarea" },
  { k: "implementation", label: "Implementation", type: "slist", multiline: true },
  { k: "channels", label: "Channels", type: "tags" },
  { k: "technology", label: "Technology", type: "tags" },
  { k: "results", label: "Results", type: "slist", multiline: true },
  {
    k: "metrics",
    label: "Key numbers (max 3 shown on cards)",
    type: "list",
    itemTitle: (x) => `${x.value} ${x.label}`,
    newItem: () => ({ label: "", value: "" }),
    addLabel: "Add number",
    fields: [
      { k: "value", label: "Value (e.g. +240%)", type: "text" },
      { k: "label", label: "Label", type: "text" },
    ],
  },
  { k: "lessons", label: "Lessons", type: "slist", multiline: true },
  {
    k: "testimonial",
    label: "Testimonial (shown only for real client results)",
    type: "group",
    fields: [
      { k: "quote", label: "Quote", type: "textarea" },
      { k: "author", label: "Name", type: "text" },
      { k: "role", label: "Role", type: "text" },
    ],
  },
  { k: "services", label: "Services involved", type: "refs", source: "services" },
  {
    k: "art",
    label: "Cover art (when there is no image)",
    type: "group",
    fields: [
      { k: "variant", label: "Style", type: "select", options: artOptions },
      { k: "tone", label: "Colour", type: "select", options: toneOptions },
    ],
  },
];
export const newWork = (): CaseStudy => ({
  slug: "",
  verified: true,
  published: false,
  client: "New client",
  industry: "",
  title: "",
  summary: "",
  challenge: "",
  objective: "",
  strategy: "",
  implementation: [],
  channels: [],
  technology: [],
  results: [],
  metrics: [],
  lessons: [],
  services: [],
  gallery: [],
  art: { variant: "flow", tone: "forest" },
});

export const industryFields: Field[] = [
  { k: "name", label: "Industry", type: "text" },
  { k: "slug", label: "URL slug", type: "text", hint: "/industries/<slug>" },
  { k: "summary", label: "Summary", type: "text" },
  { k: "image", label: "Image (optional)", type: "image" },
  { k: "problems", label: "Business problems", type: "slist", multiline: true },
  { k: "solution", label: "Our solution", type: "textarea" },
  { k: "capabilities", label: "Relevant services", type: "refs", source: "services" },
  { k: "art", label: "Cover art style", type: "select", options: artOptions },
];
export const newIndustry = (): Industry => ({ slug: "", name: "New industry", summary: "", problems: [], solution: "", capabilities: [], art: "flow" });

export const faqFields: Field[] = [
  { k: "question", label: "Question", type: "text" },
  { k: "answer", label: "Answer", type: "textarea" },
];
export const newFaq = (): Faq => ({ question: "", answer: "" });

/* ---------------- Locations (local SEO) ---------------- */

export const locationFields: Field[] = [
  { k: "published", label: "Published", type: "bool", hint: "Unpublished cities are hidden from the site, footer and sitemap." },
  { k: "city", label: "City (as people search it)", type: "text", placeholder: "Hyderabad" },
  { k: "slug", label: "URL", type: "text", hint: "springs360.in/locations/<this>" },
  { k: "region", label: "State", type: "text", placeholder: "Telangana" },
  { k: "seoTitle", label: "Google title", type: "text", hint: "Put the search phrase first, e.g. Digital Marketing Agency in Hyderabad." },
  { k: "seoDescription", label: "Google description", type: "textarea", hint: "About 150 characters. Mention the city, 2–3 services and a few areas." },
  { k: "headline", label: "Hero lines", type: "slist", hint: "One line per row. *Asterisks* = accent italic." },
  { k: "intro", label: "Hero text", type: "textarea" },
  { k: "context", label: "“Marketing in <city>” paragraphs", type: "slist", multiline: true, hint: "Write what is specific to this city. Unique local text is what helps a city page rank." },
  { k: "services", label: "Services shown", type: "refs", source: "services" },
  { k: "areas", label: "Neighbourhoods / business districts", type: "tags" },
  { k: "cities", label: "Cities covered (for Google)", type: "tags", hint: "e.g. Delhi, Noida, Gurugram. Used in the structured data as areas served." },
  {
    k: "faqs",
    label: "City FAQ",
    type: "list",
    addLabel: "Add question",
    itemTitle: (f) => f.question,
    newItem: () => ({ question: "", answer: "" }),
    fields: [
      { k: "question", label: "Question", type: "text" },
      { k: "answer", label: "Answer", type: "textarea" },
    ],
  },
  { k: "phone", label: "Local phone (optional)", type: "text", hint: "Leave empty to use the main number." },
  {
    k: "address",
    label: "Office address (only if you have a real office here)",
    type: "group",
    hint: "Leave empty if you serve this city without an office. Google penalises addresses a business doesn't operate from.",
    fields: [
      { k: "street", label: "Street address", type: "text" },
      { k: "locality", label: "Area / locality", type: "text" },
      { k: "postalCode", label: "PIN code", type: "text" },
    ],
  },
  { k: "mapsUrl", label: "Google Maps link of your Business Profile (optional)", type: "url" },
  { k: "geo", label: "Map position", type: "group", hint: "Latitude / longitude of the office or the city centre.", fields: [
    { k: "lat", label: "Latitude", type: "number" },
    { k: "lng", label: "Longitude", type: "number" },
  ] },
  { k: "art", label: "Cover art style", type: "select", options: artOptions },
];
export const newLocation = (): Location => ({
  slug: "",
  published: false,
  city: "New city",
  region: "",
  cities: [],
  areas: [],
  seoTitle: "",
  seoDescription: "",
  headline: ["Digital marketing agency", "in *City.*"],
  intro: "",
  context: [],
  services: ["local-seo", "google-business-profile", "google-ads", "meta-ads", "website-development", "social-media-management"],
  faqs: [],
  geo: { lat: 0, lng: 0 },
  art: "flow",
});
