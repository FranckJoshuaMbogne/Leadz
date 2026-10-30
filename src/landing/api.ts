import { getDb, getFirebaseAuth } from "@/lib/firebase";
import { track } from "@/lib/analytics";
import { builtInPages, normalizePage, normalizeShop } from "./defaults";
import type { Course, Grant, LandingPage, Lesson, Order, ShopConfig } from "./types";

const fsLite = () => import("firebase/firestore/lite");

async function db() {
  const [fs, d] = await Promise.all([fsLite(), getDb()]);
  return { fs, d };
}

/** Makes sure Firestore requests carry the signed-in user (admin previews, learners). */
export async function authReady() {
  const auth = await getFirebaseAuth();
  await auth.authStateReady();
  return auth;
}

/* ---------------- Landing pages ---------------- */

export async function fetchLandingPage(slug: string, withAuth = false): Promise<LandingPage | null> {
  if (withAuth) await authReady();
  const { fs, d } = await db();
  try {
    const snap = await fs.getDoc(fs.doc(d, "landingPages", slug));
    if (snap.exists()) {
      const page = normalizePage({ ...(snap.data() as LandingPage), slug });
      return page.status === "published" || withAuth ? page : null;
    }
  } catch (e) {
    // Drafts are readable by admins only: for everyone else the page doesn't exist.
    if ((e as { code?: string }).code === "permission-denied") return null;
    throw e;
  }
  return builtInPages[slug]?.() ?? null;
}

/* ---------------- Courses ---------------- */

export function sortCourses(list: Course[]) {
  return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
}

export async function fetchCourses(): Promise<Course[]> {
  const { fs, d } = await db();
  const snap = await fs.getDocs(fs.query(fs.collection(d, "courses"), fs.where("status", "==", "published")));
  return sortCourses(snap.docs.map((x) => ({ ...(x.data() as Course), slug: x.id })));
}

export async function fetchCourse(slug: string): Promise<Course | null> {
  const { fs, d } = await db();
  try {
    const snap = await fs.getDoc(fs.doc(d, "courses", slug));
    if (!snap.exists()) return null;
    const c = { ...(snap.data() as Course), slug };
    return c.status === "published" ? c : null;
  } catch {
    return null;
  }
}

export async function fetchLessons(slug: string): Promise<Lesson[]> {
  await authReady();
  const { fs, d } = await db();
  const snap = await fs.getDoc(fs.doc(d, "courseLessons", slug));
  return ((snap.data()?.lessons as Lesson[]) ?? []).filter((l) => l.title || l.video);
}

export async function fetchShop(): Promise<ShopConfig> {
  const { fs, d } = await db();
  try {
    const snap = await fs.getDoc(fs.doc(d, "shop", "config"));
    return normalizeShop(snap.exists() ? (snap.data() as ShopConfig) : null);
  } catch {
    return normalizeShop(null);
  }
}

/* ---------------- Learners ---------------- */

export async function learnerSignIn() {
  const [auth, { GoogleAuthProvider, signInWithPopup }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function learnerSignOut() {
  const [auth, { signOut }] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
  await signOut(auth);
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
}

export async function loadProfile(uid: string): Promise<Profile | null> {
  const { fs, d } = await db();
  try {
    const snap = await fs.getDoc(fs.doc(d, "learners", uid));
    return snap.exists() ? (snap.data() as Profile) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(uid: string, p: Profile) {
  const { fs, d } = await db();
  await fs.setDoc(fs.doc(d, "learners", uid), { name: p.name.slice(0, 100), email: p.email.toLowerCase(), phone: p.phone.slice(0, 30), updatedAt: fs.serverTimestamp() });
}

export async function createOrder(o: Omit<Order, "id" | "status" | "createdAt" | "note" | "keyHint">) {
  const { fs, d } = await db();
  const ref = await fs.addDoc(fs.collection(d, "orders"), {
    ...o,
    email: o.email.toLowerCase(),
    txnRef: o.txnRef.slice(0, 120),
    status: "pending",
    createdAt: fs.serverTimestamp(),
  });
  track("purchase_submitted", { course: o.courseSlug, value: o.amount, method: o.method });
  return ref.id;
}

function toOrder(id: string, x: Record<string, unknown>): Order {
  const at = x.createdAt as { toDate?: () => Date } | undefined;
  return { ...(x as unknown as Order), id, createdAt: at?.toDate?.() };
}

export async function myOrders(uid: string): Promise<Order[]> {
  const { fs, d } = await db();
  const snap = await fs.getDocs(fs.query(fs.collection(d, "orders"), fs.where("uid", "==", uid)));
  return snap.docs.map((x) => toOrder(x.id, x.data())).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

export async function myGrants(uid: string): Promise<Grant[]> {
  const { fs, d } = await db();
  const snap = await fs.getDocs(fs.query(fs.collection(d, "grants"), fs.where("uid", "==", uid)));
  return snap.docs.map((x) => x.data() as Grant);
}

/** Exchanges an access password for a grant. Returns the unlocked course slug. */
export async function redeemPassword(uid: string, email: string, password: string): Promise<string> {
  const key = password.trim().toUpperCase();
  const wrong = "This password doesn't match your email. Make sure you're signed in with the Google account you used to buy, and check the password for typos.";
  if (!/^[A-Z0-9-]{6,64}$/.test(key)) throw new Error(wrong);
  const { fs, d } = await db();
  // Learners can read a password document only when it was issued to their email.
  let courseSlug = "";
  try {
    const snap = await fs.getDoc(fs.doc(d, "accessKeys", key));
    courseSlug = (snap.data()?.courseSlug as string) ?? "";
  } catch {
    /* not issued to this email */
  }
  if (!courseSlug) throw new Error(wrong);
  const existing = await myGrants(uid);
  if (existing.some((g) => g.courseSlug === courseSlug)) return courseSlug;
  try {
    await fs.setDoc(fs.doc(d, "grants", `${uid}_${courseSlug}`), { uid, email: email.toLowerCase(), courseSlug, key, createdAt: fs.serverTimestamp() });
  } catch {
    throw new Error("This password has been turned off. Message us on WhatsApp and we'll sort it out.");
  }
  track("course_unlocked", { course: courseSlug });
  return courseSlug;
}

/* ---------------- Audit / landing leads ---------------- */

export interface LandingLead {
  intent: "audit" | "landing";
  name: string;
  phone: string;
  email?: string;
  company?: string;
  industry?: string;
  area?: string;
  message?: string;
  score?: number;
  weakest?: string;
  scores?: Record<string, number>;
  website?: string;
  revenue?: string;
  targetRevenue?: string;
  channels?: string[];
  preferredChannels?: string[];
  budget?: string;
  source?: string;
  page: string;
}

/** Fields added after the first release of the rules (kept in `outcome` if the rules are older). */
const NEWER_FIELDS = ["revenue", "targetRevenue", "preferredChannels"] as const;

export async function submitLandingLead(lead: LandingLead) {
  const clean: Record<string, unknown> = Object.fromEntries(
    Object.entries({ ...lead, source: lead.source?.slice(0, 80), page: lead.page.slice(0, 200) }).filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
  );
  const { fs, d } = await db();
  try {
    await fs.addDoc(fs.collection(d, "leads"), { ...clean, status: "new", createdAt: fs.serverTimestamp() });
  } catch (e) {
    // Older security rules don't know the newest fields: keep them as text so the lead isn't lost.
    if ((e as { code?: string }).code !== "permission-denied" || !NEWER_FIELDS.some((k) => k in clean)) throw e;
    const extra = [
      clean.revenue && `Revenue today: ${clean.revenue}`,
      clean.targetRevenue && `Revenue goal: ${clean.targetRevenue}`,
      Array.isArray(clean.preferredChannels) && `Wants customers via: ${clean.preferredChannels.join(", ")}`,
    ].filter(Boolean);
    const legacy = Object.fromEntries(Object.entries(clean).filter(([k]) => !(NEWER_FIELDS as readonly string[]).includes(k)));
    await fs.addDoc(fs.collection(d, "leads"), { ...legacy, outcome: extra.join("\n").slice(0, 1500), status: "new", createdAt: fs.serverTimestamp() });
  }
  track("generate_lead", { form: lead.intent, page: lead.page, score: lead.score });
  try {
    const w = window as Window & { fbq?: (...a: unknown[]) => void };
    w.fbq?.("track", "Lead");
  } catch {
    /* no pixel */
  }
}
