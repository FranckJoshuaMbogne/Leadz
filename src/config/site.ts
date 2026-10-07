/**
 * Central site configuration.
 *
 * Anything that depends on real business information lives here so it can be
 * changed in one place. Values that are not yet confirmed are left `null` and
 * the UI hides them rather than showing a placeholder.
 *
 * The production URL is configurable through the `VITE_SITE_URL` environment
 * variable. Until a production domain is chosen it falls back to the current
 * Firebase Hosting URL.
 */

const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env ?? {};

function stripSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export const site = {
  name: "Springs 360",
  wordmark: "SPRINGS 360",
  tagline: "We build growth systems.",
  description:
    "Springs 360 is a 360° growth agency connecting strategy, marketing, technology, AI and data into one growth system — so ambitious businesses attract, convert and retain customers.",
  url: stripSlash(env.VITE_SITE_URL || "https://leadzindb.web.app"),
  locale: "en_IN",
  defaultOgImage: "/og/springs360-og.png",

  contact: {
    /** Public email — set once a Springs 360 mailbox exists. Hidden while null. */
    email: (env.VITE_CONTACT_EMAIL as string | undefined) || null,
    /** Carried over from the previous site. Confirm before launch. */
    phoneDisplay: "+91 85229 97932",
    phoneHref: "tel:+918522997932",
    whatsappHref: "https://wa.me/918522997932",
    /** Street address — hidden while null. */
    address: null as string | null,
    hours: "Monday – Friday, 9:00 – 18:00 IST",
  },

  /**
   * Social profiles. Only add URLs that actually exist — the footer renders
   * nothing for an empty list.
   */
  social: [] as { label: string; href: string }[],

  /** Optional webhook (e.g. Zapier/Make/CRM) that also receives form leads. */
  leadWebhook: (env.VITE_LEAD_WEBHOOK_URL as string | undefined) || null,

  /** Firestore-backed Insights CMS. Static articles are always available. */
  cmsEnabled: env.VITE_CMS_ENABLED !== "false",
} as const;

export const primaryNav = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
] as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
