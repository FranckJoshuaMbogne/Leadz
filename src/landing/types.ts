/**
 * Landing pages, courses and the course shop — all edited in /admin.
 *
 * Firestore
 *   landingPages/{slug}     one page per URL (springs360.in/{slug}); public read when published
 *   courses/{slug}          course card + free preview; public read when published
 *   courseLessons/{slug}    full lesson videos; readable only with an unlocked grant
 *   shop/config             payment methods + checkout texts (public read)
 *   learners/{uid}          learner profile (name, email, phone)
 *   orders/{id}             "I have paid" submissions, verified by an admin
 *   accessKeys/{password}   issued by an admin on approval (email + course); never readable by learners
 *   grants/{uid_course}     created when a learner enters a valid password; unlocks courseLessons
 */

export type Template = "audit" | "courses" | "leadform";
export type SectionKind = "cards" | "list" | "steps" | "chips" | "faq" | "testimonials" | "text";

export interface LpItem {
  title: string;
  text: string;
}

export interface LpSection {
  kind: SectionKind;
  eyebrow: string;
  title: string;
  text: string;
  items: LpItem[];
}

export interface QuizPillar {
  key: string;
  name: string;
  short: string;
  description: string;
  /** Advice shown on the result screen when this pillar is weak. */
  fix: string;
  /** Score (0–100) shown for this pillar on the example card in the hero. */
  example: number;
}

export interface QuizQuestion {
  pillar: string;
  question: string;
  why: string;
}

export interface LandingPage {
  slug: string;
  status: "draft" | "published";
  template: Template;
  /** Internal name in the admin list. */
  name: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  /** Small label at the top right (e.g. "Free growth audit"). */
  tag: string;
  hero: {
    eyebrow: string;
    /** Wrap words in *asterisks* to set them in gold italic. */
    headline: string;
    text: string;
    ctaLabel: string;
    ctaNote: string;
    chips: string[];
    image: string;
    video: string;
  };
  sections: LpSection[];
  quiz: {
    pillars: QuizPillar[];
    questions: QuizQuestion[];
    exampleName: string;
    exampleSubtitle: string;
    exampleNote: string;
    formTitle: string;
    formText: string;
    businessTypes: string[];
    areaLabel: string;
    /** Monthly revenue ranges, used for "today" and "goal". Empty = questions hidden. */
    revenueRanges: string[];
    /** Ways customers contact a business (call, WhatsApp, walk-in…). Empty = questions hidden. */
    contactChannels: string[];
    /** Monthly marketing budget ranges. Empty = question hidden. */
    budgetRanges: string[];
    doneText: string;
  };
  courses: {
    eyebrow: string;
    title: string;
    text: string;
    /** Course slugs to show, in order. Empty = every published course. */
    slugs: string[];
  };
  form: {
    title: string;
    text: string;
    askEmail: boolean;
    askCompany: boolean;
    messageLabel: string;
    buttonLabel: string;
    doneText: string;
  };
  final: { title: string; text: string; ctaLabel: string };
  /** Show a floating WhatsApp button (uses the number in Hero, contact & links). */
  whatsapp: boolean;
}

/* ---------------- Courses ---------------- */

export interface Course {
  slug: string;
  status: "draft" | "published";
  order: number;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  /** Free ~30 second introduction (YouTube, Vimeo, Google Drive or .mp4 link). */
  previewVideo: string;
  price: number;
  compareAt: number;
  currency: string;
  duration: string;
  level: string;
  instructor: string;
  outcomes: string[];
  includes: string[];
  /** Lesson titles shown publicly (copied from the lessons when saved in the admin). */
  syllabus?: { title: string; duration: string }[];
}

export interface Lesson {
  title: string;
  duration: string;
  video: string;
  notes: string;
}

/* ---------------- Shop ---------------- */

export type PayKind = "upi" | "gpay" | "card" | "applepay" | "paypal" | "bank" | "other";

export interface PayMethod {
  id: string;
  label: string;
  kind: PayKind;
  enabled: boolean;
  /** Shown in the payment pop-up. One step per line. */
  instructions: string;
  payeeLabel: string;
  payeeValue: string;
  qr: string;
  link: string;
  linkLabel: string;
}

export interface ShopConfig {
  methods: PayMethod[];
  /** Pop-up after paying: what the learner should enter. */
  confirmTitle: string;
  confirmText: string;
  /** Shown once the payment details are submitted. */
  afterText: string;
  /** Shown above the password box on /learn. */
  unlockText: string;
}

export type OrderStatus = "pending" | "approved" | "rejected";

export interface Order {
  id: string;
  uid: string;
  email: string;
  phone: string;
  courseSlug: string;
  courseTitle: string;
  amount: number;
  currency: string;
  method: string;
  methodLabel: string;
  payerName: string;
  payerPhone: string;
  txnRef: string;
  status: OrderStatus;
  note?: string;
  keyHint?: string;
  createdAt?: Date;
}

export interface Grant {
  uid: string;
  email: string;
  courseSlug: string;
  key: string;
}
