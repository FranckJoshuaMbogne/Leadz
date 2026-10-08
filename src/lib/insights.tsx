import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { site } from "@/config/site";
import { EDITORIAL_AUTHOR, staticInsights, type Insight, type InsightMeta } from "@/data/insights";
import { readingTime } from "./utils";

/* ------------------------------------------------------------------ */
/* Firestore document → Insight                                        */
/* ------------------------------------------------------------------ */

export interface InsightDoc {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  author?: string;
  coverImage?: string;
  coverAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedService?: string;
  publishedAt: string;
  updatedAt?: string;
  status: "draft" | "published";
  featured?: boolean;
}

export function docToInsight(d: InsightDoc): Insight {
  return {
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt,
    category: d.category,
    author: d.author || EDITORIAL_AUTHOR,
    publishedAt: d.publishedAt,
    updatedAt: d.updatedAt,
    readingMinutes: readingTime(d.content || ""),
    coverImage: d.coverImage || undefined,
    coverAlt: d.coverAlt || undefined,
    seoTitle: d.seoTitle || undefined,
    seoDescription: d.seoDescription || undefined,
    relatedService: d.relatedService || undefined,
    featured: !!d.featured,
    content: d.content || "",
    source: "cms",
  };
}

export async function fetchPublishedInsights(): Promise<Insight[]> {
  const [{ getDb }, fs] = await Promise.all([import("./firebase"), import("firebase/firestore/lite")]);
  const db = await getDb();
  const snap = await fs.getDocs(fs.query(fs.collection(db, "insights"), fs.where("status", "==", "published")));
  const today = new Date().toISOString().slice(0, 10);
  return snap.docs
    .map((doc) => docToInsight(doc.data() as InsightDoc))
    .filter((i) => i.slug && i.title && i.publishedAt.slice(0, 10) <= today);
}

/* ------------------------------------------------------------------ */
/* Provider: static articles + CMS articles                            */
/* ------------------------------------------------------------------ */

interface InsightsState {
  cms: Insight[];
  live: boolean;
  loading: boolean;
  ensureLive: () => void;
}

const Ctx = createContext<InsightsState | null>(null);

declare global {
  interface Window {
    __CMS_INSIGHTS__?: Insight[];
  }
}

/** CMS articles embedded into the HTML at build time (keeps hydration consistent). */
export function readEmbeddedInsights(): Insight[] {
  if (typeof window === "undefined") return [];
  try {
    const el = document.getElementById("__CMS_INSIGHTS__");
    return el?.textContent ? (JSON.parse(el.textContent) as Insight[]) : [];
  } catch {
    return [];
  }
}

export function InsightsProvider({ initial, children }: { initial?: Insight[]; children: ReactNode }) {
  const [cms, setCms] = useState<Insight[]>(() => initial ?? readEmbeddedInsights());
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const ensureLive = useCallback(() => setRequested(true), []);

  useEffect(() => {
    if (!requested || live || loading || !site.cmsEnabled) return;
    setLoading(true);
    fetchPublishedInsights()
      .then((items) => setCms(items))
      .catch(() => {
        /* keep build-time content if Firestore is unreachable */
      })
      .finally(() => {
        setLive(true);
        setLoading(false);
      });
  }, [requested, live, loading]);

  const value = useMemo(() => ({ cms, live: live || !site.cmsEnabled, loading, ensureLive }), [cms, live, loading, ensureLive]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function byDateDesc(a: InsightMeta, b: InsightMeta) {
  return b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title);
}

/**
 * All published insights (metadata). Pass `{ live: true }` on pages where it
 * is worth loading articles published since the last build.
 */
export function useInsights(opts: { live?: boolean } = {}) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useInsights must be used inside <InsightsProvider>");
  const { ensureLive } = ctx;
  useEffect(() => {
    if (opts.live) ensureLive();
  }, [opts.live, ensureLive]);

  const all = useMemo(() => {
    const map = new Map<string, InsightMeta | Insight>();
    staticInsights.forEach((i) => map.set(i.slug, i));
    ctx.cms.forEach((i) => map.set(i.slug, i)); // CMS overrides same slug
    return Array.from(map.values()).sort(byDateDesc);
  }, [ctx.cms]);

  return { insights: all as (InsightMeta & { content?: string })[], cms: ctx.cms, live: ctx.live, loading: ctx.loading };
}
