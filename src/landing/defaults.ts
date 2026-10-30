import type { LandingPage, PayMethod, ShopConfig, Template } from "./types";

/* ------------------------------------------------------------------ */
/* Shared empty blocks                                                 */
/* ------------------------------------------------------------------ */

const emptyQuiz = (): LandingPage["quiz"] => ({
  pillars: [],
  questions: [],
  exampleName: "",
  exampleSubtitle: "",
  exampleNote: "",
  formTitle: "",
  formText: "",
  businessTypes: [],
  areaLabel: "",
  revenueRanges: [],
  contactChannels: [],
  budgetRanges: [],
  doneText: "",
});

const emptyCourses = (): LandingPage["courses"] => ({ eyebrow: "", title: "", text: "", slugs: [] });

const emptyForm = (): LandingPage["form"] => ({
  title: "Tell us about your business",
  text: "We reply on WhatsApp within one working day.",
  askEmail: true,
  askCompany: true,
  messageLabel: "What do you need help with?",
  buttonLabel: "Send",
  doneText: "Thanks. We'll be in touch on WhatsApp within one working day.",
});

/* ------------------------------------------------------------------ */
/* Template: free growth audit                                         */
/* ------------------------------------------------------------------ */

export const auditTemplate = (slug = "audit"): LandingPage => ({
  slug,
  status: "published",
  template: "audit",
  name: "Free growth audit",
  seoTitle: "Free Growth Audit for Local Businesses in Hyderabad",
  seoDescription: "Find what's stopping customers from calling you. A free 3-minute audit that scores your business on the 5 pillars of local growth.",
  ogImage: "",
  tag: "Free growth audit",
  hero: {
    eyebrow: "For local businesses in Hyderabad",
    headline: "Find out what's *really stopping* customers from calling you.",
    text: "In 3 minutes, your business is scored on the 5 pillars that bring in local customers. You see your weakest point and what to fix first.",
    ctaLabel: "Start my free audit",
    ctaNote: "No call. No card. Score shown instantly.",
    chips: ["3 minutes", "100% free", "Expert review on WhatsApp"],
    image: "",
    video: "",
  },
  sections: [
    {
      kind: "cards",
      eyebrow: "What we check",
      title: "The 5 pillars behind every busy local business.",
      text: "Most owners fix the wrong thing first. The audit shows which pillar is holding the other four back.",
      items: [],
    },
    {
      kind: "list",
      eyebrow: "What you get",
      title: "When the audit ends, *you know what to do.*",
      text: "",
      items: [
        { title: "Your score out of 100", text: "Plus a score for each pillar, so you see where you stand." },
        { title: "The one thing blocking you", text: "Your weakest pillar, named plainly. Not 20 generic tips." },
        { title: "Your priority actions", text: "What to fix, in order, starting with what brings enquiries fastest." },
        { title: "A personal review on WhatsApp", text: "A Springs 360 strategist checks your Google profile, website and ads, then sends findings within 24 hours." },
      ],
    },
    {
      kind: "steps",
      eyebrow: "How it works",
      title: "Three steps. About three minutes.",
      text: "",
      items: [
        { title: "Answer 10 quick questions", text: "Yes, partly or no. About your Google profile, website, ads, social and follow-up." },
        { title: "See your score instantly", text: "Your 360° score and weakest pillar appear on screen right away." },
        { title: "Get your expert review", text: "Leave your WhatsApp number and we send a personal breakdown with your next 3 moves." },
      ],
    },
    {
      kind: "chips",
      eyebrow: "Who it's for",
      title: "Service businesses that live on local enquiries.",
      text: "Working across Gachibowli, Madhapur, Hitech City, Kondapur, Banjara Hills, Jubilee Hills, Ameerpet, Attapur and the rest of Hyderabad.",
      items: ["Cleaning services", "Clinics & dentists", "Salons & spas", "Interior designers", "Real estate", "Coaching & tuition", "Restaurants & cafés", "Gyms & studios", "Boutiques & tailors"].map((t) => ({ title: t, text: "" })),
    },
    {
      kind: "faq",
      eyebrow: "Questions",
      title: "Before you start",
      text: "",
      items: [
        { title: "Is it really free?", text: "Yes. The score and the WhatsApp review cost nothing. If you want help fixing what we find, we'll share options. You decide." },
        { title: "Will someone call me to sell something?", text: "No cold calls. We send your review on WhatsApp. If you reply, we talk. If not, that's the end of it." },
        { title: "I don't run ads yet. Is this still useful?", text: "Yes. Most businesses we audit should fix their Google profile and enquiry follow-up before spending on ads. The audit tells you if that's you." },
        { title: "What do you do with my number?", text: "We use it only to send your audit and follow up on it. We never share or sell it." },
      ],
    },
  ],
  quiz: {
    pillars: [
      { key: "vis", name: "Google visibility", short: "Visibility", example: 70, description: "Can nearby customers find you on Google Maps and search, and do your reviews make them trust you?", fix: "Complete and optimise your Google Business Profile, then run a review system so every happy customer leaves one." },
      { key: "web", name: "Website conversion", short: "Website", example: 40, description: "When someone lands on your site, do they call or WhatsApp you, or leave?", fix: "Put a Call and WhatsApp button on the first mobile screen and build one landing page per key service." },
      { key: "ads", name: "Ads & tracking", short: "Ads", example: 20, description: "Are you showing up for people already searching, and do you know what each lead costs?", fix: "Start a small Google Search campaign on high-intent keywords with call and WhatsApp tracking from day one." },
      { key: "soc", name: "Social proof", short: "Social", example: 50, description: "Does your Instagram and Facebook show real work that makes strangers trust you?", fix: "Post weekly with real before/after work and client results. Proof beats design." },
      { key: "fol", name: "Lead follow-up", short: "Follow-up", example: 30, description: "How fast you reply, and whether you chase every enquiry until it books.", fix: "Set up an instant WhatsApp reply and a lead sheet so every enquiry is answered in minutes and followed up." },
    ],
    questions: [
      { pillar: "vis", question: "Do you have a verified Google Business Profile with your services, photos and hours filled in?", why: "Most local customers find a business on Google Maps before they visit any website." },
      { pillar: "vis", question: "Do you have 30+ Google reviews with an average of 4.5 or higher?", why: "Review count and rating decide who gets the call among the top 3 results." },
      { pillar: "web", question: "On a phone, does your website show a Call or WhatsApp button on the first screen?", why: "Most local service traffic is mobile. If the button isn't visible, visitors leave." },
      { pillar: "web", question: "Does each main service have its own page with prices or a clear offer?", why: "A dedicated page converts far better than one generic Services list." },
      { pillar: "ads", question: "Are you currently running Google Search or Meta ads?", why: "Search ads catch people already looking for what you sell, today." },
      { pillar: "ads", question: "Do you know your cost per lead and cost per booked customer?", why: "Without these numbers, you can't tell good ad spend from wasted spend." },
      { pillar: "soc", question: "Do you post on Instagram or Facebook at least once a week?", why: "An empty or stale profile makes people doubt you're still open." },
      { pillar: "soc", question: "Do you show real proof: before/after photos, client videos, results?", why: "Real work convinces more than any designed post or offer." },
      { pillar: "fol", question: "Do you reply to every new enquiry within 15 minutes, even after hours?", why: "Leads contacted within minutes book far more often than those contacted hours later." },
      { pillar: "fol", question: "Do you log every enquiry (sheet or CRM) and follow up until it books or says no?", why: "Many lost customers were simply never followed up." },
    ],
    exampleName: "Sparkle Home Services",
    exampleSubtitle: "Home cleaning · Gachibowli",
    exampleNote: "Bottleneck found: Ads & tracking. Visible on Google, but no paid demand and no idea what a lead costs.",
    formTitle: "Get your free personal growth plan",
    formText: "Tell us a little about your business. A strategist checks your Google profile, website and ads, then sends you a plan to reach your revenue goal, on WhatsApp within 24 hours.",
    businessTypes: ["Cleaning service", "Clinic / dental", "Salon / spa", "Interior design", "Real estate", "Coaching / tuition", "Restaurant / café", "Gym / studio", "Retail / boutique", "Other"],
    areaLabel: "Cities or areas you serve",
    revenueRanges: ["Under ₹1 lakh", "₹1–3 lakh", "₹3–10 lakh", "₹10–25 lakh", "₹25 lakh – 1 crore", "Over ₹1 crore"],
    contactChannels: ["Phone call", "WhatsApp", "Walk-in", "Online booking", "Website form", "Instagram / Facebook DM", "Email", "Justdial / marketplaces"],
    budgetRanges: ["Nothing yet", "Under ₹15,000", "₹15,000–50,000", "₹50,000–1.5 lakh", "Over ₹1.5 lakh"],
    doneText: "Your personal growth plan will arrive on WhatsApp within 24 hours.",
  },
  courses: emptyCourses(),
  form: emptyForm(),
  final: {
    title: "Three minutes from now, you'll know your score.",
    text: "Find the pillar that's costing you customers before you spend another rupee on marketing.",
    ctaLabel: "Start my free audit",
  },
  whatsapp: false,
});

/* ------------------------------------------------------------------ */
/* Template: online training                                           */
/* ------------------------------------------------------------------ */

export const trainingTemplate = (slug = "training"): LandingPage => ({
  slug,
  status: "published",
  template: "courses",
  name: "Online training",
  seoTitle: "Online Digital Marketing Training",
  seoDescription: "Practical video courses from Springs 360. Watch a free preview of every course, pay once and learn at your own pace.",
  ogImage: "",
  tag: "Online training",
  hero: {
    eyebrow: "Springs 360 training",
    headline: "Learn the marketing skills *that bring real customers.*",
    text: "Practical video courses built from the campaigns we run for clients. Watch a free preview of any course before you pay.",
    ctaLabel: "See the courses",
    ctaNote: "Free preview on every course.",
    chips: ["Watch on phone or laptop", "Pay once, keep access", "UPI, cards, PayPal"],
    image: "",
    video: "",
  },
  sections: [
    {
      kind: "steps",
      eyebrow: "How it works",
      title: "From preview to full access in four steps.",
      text: "",
      items: [
        { title: "Watch the free preview", text: "Every course has a short introduction video. See how it's taught before you decide." },
        { title: "Sign in and choose how to pay", text: "Sign in with Google, then pay by UPI, Google Pay, card, Apple Pay or PayPal." },
        { title: "Confirm your payment", text: "Enter the name and phone number you paid with. We verify it." },
        { title: "Get your password", text: "We send your access password. Sign in with your email and password to watch the full course." },
      ],
    },
    {
      kind: "list",
      eyebrow: "What you get",
      title: "Everything you need to *apply it the same week.*",
      text: "",
      items: [
        { title: "Step-by-step videos", text: "Short lessons you can follow on screen, in order." },
        { title: "Real examples", text: "Taken from live campaigns, not theory." },
        { title: "Learn at your own pace", text: "Pause, rewatch and come back any time." },
        { title: "Help on WhatsApp", text: "Stuck on a lesson? Message us." },
      ],
    },
    {
      kind: "faq",
      eyebrow: "Questions",
      title: "Before you buy",
      text: "",
      items: [
        { title: "Can I see the course before paying?", text: "Yes. Every course has a free introduction video on its page." },
        { title: "How do I get access after paying?", text: "Enter the name and phone number you paid with. Once we verify the payment, we send you a password. Use it with your email on the My courses page." },
        { title: "Which payment methods can I use?", text: "UPI, Google Pay, debit or credit card, Apple Pay and PayPal. The steps for each are shown when you choose it." },
        { title: "Does the password unlock every course?", text: "No. Each password unlocks the course you bought, for the email you signed in with." },
      ],
    },
  ],
  quiz: emptyQuiz(),
  courses: {
    eyebrow: "Courses",
    title: "Pick a course. *Watch the preview free.*",
    text: "",
    slugs: [],
  },
  form: emptyForm(),
  final: {
    title: "Start with the free preview.",
    text: "Watch the introduction, then decide.",
    ctaLabel: "See the courses",
  },
  whatsapp: true,
});

/* ------------------------------------------------------------------ */
/* Template: simple lead form                                          */
/* ------------------------------------------------------------------ */

export const leadformTemplate = (slug = ""): LandingPage => ({
  slug,
  status: "draft",
  template: "leadform",
  name: "Lead form page",
  seoTitle: "",
  seoDescription: "",
  ogImage: "",
  tag: "",
  hero: {
    eyebrow: "",
    headline: "Your offer in one line, with the *key words* highlighted.",
    text: "One or two sentences on who it's for and what they get.",
    ctaLabel: "Get started",
    ctaNote: "",
    chips: [],
    image: "",
    video: "",
  },
  sections: [
    { kind: "list", eyebrow: "What you get", title: "What you get", text: "", items: [{ title: "Benefit", text: "Why it matters." }] },
    { kind: "faq", eyebrow: "Questions", title: "Questions", text: "", items: [{ title: "Question?", text: "Answer." }] },
  ],
  quiz: emptyQuiz(),
  courses: emptyCourses(),
  form: emptyForm(),
  final: { title: "Ready?", text: "", ctaLabel: "Get started" },
  whatsapp: true,
});

export const templates: { id: Template; label: string; text: string; make: (slug?: string) => LandingPage }[] = [
  { id: "audit", label: "Free audit (quiz)", text: "Visitors answer questions, see a score, then leave their WhatsApp number.", make: auditTemplate },
  { id: "courses", label: "Online training", text: "Course cards with free preview videos and checkout.", make: trainingTemplate },
  { id: "leadform", label: "Lead form", text: "Offer, benefits, FAQ and a contact form.", make: leadformTemplate },
];

/** Pages that work before anything is saved in the admin. */
export const builtInPages: Record<string, () => LandingPage> = {
  audit: () => auditTemplate("audit"),
  training: () => trainingTemplate("training"),
};

/** Fills fields missing from older saved documents. */
export function normalizePage(raw: Partial<LandingPage> & { slug: string }): LandingPage {
  const base = (templates.find((t) => t.id === raw.template) ?? templates[2]).make(raw.slug);
  return {
    ...base,
    ...raw,
    hero: { ...base.hero, ...(raw.hero ?? {}) },
    quiz: { ...base.quiz, ...(raw.quiz ?? {}) },
    courses: { ...base.courses, ...(raw.courses ?? {}) },
    form: { ...base.form, ...(raw.form ?? {}) },
    final: { ...base.final, ...(raw.final ?? {}) },
    sections: raw.sections ?? base.sections,
  };
}

/* ------------------------------------------------------------------ */
/* Shop                                                                */
/* ------------------------------------------------------------------ */

const method = (id: string, label: string, kind: PayMethod["kind"], payeeLabel: string, linkLabel: string, instructions: string): PayMethod => ({
  id,
  label,
  kind,
  enabled: false,
  instructions,
  payeeLabel,
  payeeValue: "",
  qr: "",
  link: "",
  linkLabel,
});

export const defaultShop = (): ShopConfig => ({
  methods: [
    method("upi", "UPI", "upi", "UPI ID", "", "Open any UPI app (PhonePe, Paytm, BHIM…).\nScan the QR code or pay to the UPI ID above.\nPay the exact amount shown.\nKeep the transaction ID."),
    method("gpay", "Google Pay", "gpay", "Google Pay number / UPI ID", "", "Open Google Pay.\nPay to the number or UPI ID above.\nPay the exact amount shown."),
    method("card", "Debit / credit card", "card", "", "Pay by card", "Tap the button below to open the secure card payment page.\nPay the exact amount shown.\nCome back here and confirm your payment."),
    method("applepay", "Apple Pay", "applepay", "", "Pay with Apple Pay", "Open the payment page below on your iPhone or Mac.\nChoose Apple Pay and confirm.\nCome back here and confirm your payment."),
    method("paypal", "PayPal", "paypal", "PayPal email", "Pay with PayPal", "Tap the PayPal button or send the amount to the PayPal email above.\nChoose 'Paying for goods or services'.\nCome back here and confirm your payment."),
  ],
  confirmTitle: "Confirm your payment",
  confirmText: "Enter the name and phone number used for the payment so we can find it.",
  afterText: "Thanks. We're verifying your payment. You'll receive your access password on WhatsApp, usually within a few hours.",
  unlockText: "Enter the password we sent you after your payment was verified.",
});

export function normalizeShop(raw?: Partial<ShopConfig> | null): ShopConfig {
  const d = defaultShop();
  return { ...d, ...(raw ?? {}), methods: raw?.methods?.length ? raw.methods : d.methods };
}
