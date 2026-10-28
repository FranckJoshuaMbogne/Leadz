import { getDb } from "@/lib/firebase";
import { normalizePage, normalizeShop } from "@/landing/defaults";
import { sortCourses } from "@/landing/api";
import type { Course, LandingPage, Lesson, Order, OrderStatus, ShopConfig } from "@/landing/types";

const fsLite = () => import("firebase/firestore/lite");
async function db() {
  const [fs, d] = await Promise.all([fsLite(), getDb()]);
  return { fs, d };
}
const plain = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

/* ---------------- Landing pages ---------------- */

export async function listPages(): Promise<(LandingPage & { updatedAt?: Date })[]> {
  const { fs, d } = await db();
  const snap = await fs.getDocs(fs.collection(d, "landingPages"));
  return snap.docs.map((x) => ({ ...normalizePage({ ...(x.data() as LandingPage), slug: x.id }), updatedAt: x.data().updatedAt?.toDate?.() }));
}

export async function savePage(page: LandingPage, previousSlug?: string) {
  const { fs, d } = await db();
  await fs.setDoc(fs.doc(d, "landingPages", page.slug), { ...plain(page), updatedAt: fs.serverTimestamp() });
  if (previousSlug && previousSlug !== page.slug) await fs.deleteDoc(fs.doc(d, "landingPages", previousSlug));
}

export async function deletePage(slug: string) {
  const { fs, d } = await db();
  await fs.deleteDoc(fs.doc(d, "landingPages", slug));
}

export async function pageExists(slug: string) {
  const { fs, d } = await db();
  return (await fs.getDoc(fs.doc(d, "landingPages", slug))).exists();
}

/* ---------------- Courses ---------------- */

export type CourseWithLessons = Course & { lessons: Lesson[] };

export async function listCoursesAdmin(): Promise<CourseWithLessons[]> {
  const { fs, d } = await db();
  const [cs, ls] = await Promise.all([fs.getDocs(fs.collection(d, "courses")), fs.getDocs(fs.collection(d, "courseLessons"))]);
  const lessons = new Map(ls.docs.map((x) => [x.id, (x.data().lessons as Lesson[]) ?? []]));
  return sortCourses(cs.docs.map((x) => ({ ...(x.data() as Course), slug: x.id }))).map((c) => ({ ...c, lessons: lessons.get(c.slug) ?? [] }));
}

export async function saveCourse(c: CourseWithLessons, previousSlug?: string) {
  const { fs, d } = await db();
  const { lessons, ...course } = c;
  const syllabus = lessons.filter((l) => l.title).map((l) => ({ title: l.title, duration: l.duration ?? "" }));
  await fs.setDoc(fs.doc(d, "courses", c.slug), { ...plain(course), syllabus, price: Number(course.price) || 0, compareAt: Number(course.compareAt) || 0, order: Number(course.order) || 0, updatedAt: fs.serverTimestamp() });
  await fs.setDoc(fs.doc(d, "courseLessons", c.slug), { lessons: plain(lessons), updatedAt: fs.serverTimestamp() });
  if (previousSlug && previousSlug !== c.slug) {
    await fs.deleteDoc(fs.doc(d, "courses", previousSlug));
    await fs.deleteDoc(fs.doc(d, "courseLessons", previousSlug));
  }
}

export async function deleteCourse(slug: string) {
  const { fs, d } = await db();
  await fs.deleteDoc(fs.doc(d, "courses", slug));
  await fs.deleteDoc(fs.doc(d, "courseLessons", slug));
}

/* ---------------- Shop ---------------- */

export async function loadShopAdmin(): Promise<{ shop: ShopConfig; saved: boolean }> {
  const { fs, d } = await db();
  const snap = await fs.getDoc(fs.doc(d, "shop", "config"));
  return { shop: normalizeShop(snap.exists() ? (snap.data() as ShopConfig) : null), saved: snap.exists() };
}

export async function saveShop(shop: ShopConfig) {
  const { fs, d } = await db();
  await fs.setDoc(fs.doc(d, "shop", "config"), { ...plain(shop), updatedAt: fs.serverTimestamp() });
}

/* ---------------- Orders & access passwords ---------------- */

export async function listOrders(): Promise<(Order & { learnerPhone?: string; learnerName?: string })[]> {
  const { fs, d } = await db();
  const snap = await fs.getDocs(fs.query(fs.collection(d, "orders"), fs.orderBy("createdAt", "desc"), fs.limit(500)));
  return snap.docs.map((x) => {
    const v = x.data();
    return { ...(v as Order), id: x.id, createdAt: v.createdAt?.toDate?.() };
  });
}

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I/L

/** Random, easy-to-read password such as S360-K7QM-R4XP-9TNA. */
export function newPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `S360-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

export interface AccessKey {
  id: string;
  email: string;
  courseSlug: string;
  orderId?: string;
  revoked?: boolean;
  createdAt?: Date;
}

/** Issues a password for one email + course (and approves the order if given). */
export async function issuePassword(opts: { email: string; courseSlug: string; orderId?: string }) {
  const { fs, d } = await db();
  const key = newPassword();
  await fs.setDoc(fs.doc(d, "accessKeys", key), {
    email: opts.email.trim().toLowerCase(),
    courseSlug: opts.courseSlug,
    orderId: opts.orderId ?? "",
    revoked: false,
    createdAt: fs.serverTimestamp(),
  });
  if (opts.orderId) await fs.updateDoc(fs.doc(d, "orders", opts.orderId), { status: "approved", keyHint: key.slice(-4), updatedAt: fs.serverTimestamp() });
  return key;
}

export async function setOrderStatus(id: string, status: OrderStatus, note?: string) {
  const { fs, d } = await db();
  await fs.updateDoc(fs.doc(d, "orders", id), { status, ...(note !== undefined ? { note } : {}), updatedAt: fs.serverTimestamp() });
}

export async function deleteOrder(id: string) {
  const { fs, d } = await db();
  await fs.deleteDoc(fs.doc(d, "orders", id));
}

export async function listKeys(): Promise<AccessKey[]> {
  const { fs, d } = await db();
  const snap = await fs.getDocs(fs.collection(d, "accessKeys"));
  return snap.docs
    .map((x) => ({ ...(x.data() as AccessKey), id: x.id, createdAt: x.data().createdAt?.toDate?.() }))
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

/** Turns a password off and removes the access it already unlocked. */
export async function revokeKey(key: string) {
  const { fs, d } = await db();
  await fs.updateDoc(fs.doc(d, "accessKeys", key), { revoked: true });
  const grants = await fs.getDocs(fs.query(fs.collection(d, "grants"), fs.where("key", "==", key)));
  await Promise.all(grants.docs.map((g) => fs.deleteDoc(g.ref)));
}

export async function restoreKey(key: string) {
  const { fs, d } = await db();
  await fs.updateDoc(fs.doc(d, "accessKeys", key), { revoked: false });
}

export async function learnerPhones(): Promise<Map<string, { name: string; phone: string }>> {
  const { fs, d } = await db();
  const snap = await fs.getDocs(fs.collection(d, "learners"));
  return new Map(snap.docs.map((x) => [x.id, { name: x.data().name ?? "", phone: x.data().phone ?? "" }]));
}
