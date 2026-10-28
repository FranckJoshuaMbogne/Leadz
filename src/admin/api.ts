import { getDb } from "@/lib/firebase";
import { mergeContent, sectionDoc, type SectionId } from "@/content/defaults";
import type { Content } from "@/content/types";
import { slugify } from "@/lib/utils";

export type { SectionId };

const fsLite = () => import("firebase/firestore/lite");

/** Latest content (Firestore over the built-in content) and when each section was saved. */
export async function loadContent(): Promise<{ content: Content; saved: Partial<Record<SectionId, string>> }> {
  const [fs, db] = await Promise.all([fsLite(), getDb()]);
  const snap = await fs.getDocs(fs.collection(db, "content"));
  const docs: Record<string, Record<string, unknown>> = {};
  const saved: Partial<Record<SectionId, string>> = {};
  snap.forEach((d) => {
    docs[d.id] = d.data();
    const at = d.data().updatedAt as { toDate?: () => Date } | undefined;
    saved[d.id as SectionId] = at?.toDate ? at.toDate().toISOString() : "saved";
  });
  return { content: mergeContent(docs), saved };
}

export async function saveSection(id: SectionId, content: Content) {
  const [fs, db] = await Promise.all([fsLite(), getDb()]);
  const data = JSON.parse(JSON.stringify(sectionDoc(content, id))); // drops undefined values
  await fs.setDoc(fs.doc(db, "content", id), { ...data, updatedAt: fs.serverTimestamp() });
}

/* ---------------- Images ---------------- */

const MAX_BYTES = 900_000; // under Firestore's 1 MB document limit

function blobToDataUrl(b: Blob) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(b);
  });
}

async function compress(file: File, maxSide: number) {
  const bmp = await createImageBitmap(file);
  let side = maxSide;
  let quality = 0.85;
  for (let attempt = 0; attempt < 8; attempt++) {
    const scale = Math.min(1, side / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", quality));
    if (blob) {
      const data = await blobToDataUrl(blob);
      if (data.length < MAX_BYTES) return { data, w, h };
    }
    if (quality > 0.6) quality -= 0.1;
    else side = Math.round(side * 0.8);
  }
  throw new Error("This image is too large. Try a smaller one.");
}

/** Compresses an image to WebP and stores it in Firestore. Returns "media:<id>". */
export async function uploadImage(file: File, maxSide = 1800): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const { data, w, h } = await compress(file, maxSide);
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 40) || "image";
  const id = `${base}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const [fs, db] = await Promise.all([fsLite(), getDb()]);
  await fs.setDoc(fs.doc(db, "media", id), { data, name: file.name, w, h, size: data.length, createdAt: fs.serverTimestamp() });
  return `media:${id}`;
}

/* ---------------- Leads ---------------- */

export const leadStatuses = ["new", "contacted", "qualified", "won", "closed", "spam"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export interface Lead {
  id: string;
  intent: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  industry?: string;
  channels?: string[];
  budget?: string;
  challenge?: string;
  outcome?: string;
  message?: string;
  page?: string;
  area?: string;
  score?: number;
  weakest?: string;
  scores?: Record<string, number>;
  source?: string;
  status: LeadStatus;
  notes?: string;
  createdAt?: Date;
}

export async function loadLeads(): Promise<Lead[]> {
  const [fs, db] = await Promise.all([fsLite(), getDb()]);
  const snap = await fs.getDocs(fs.query(fs.collection(db, "leads"), fs.orderBy("createdAt", "desc"), fs.limit(500)));
  return snap.docs.map((d) => {
    const x = d.data();
    return { ...(x as Omit<Lead, "id" | "createdAt">), id: d.id, status: (x.status as LeadStatus) ?? "new", createdAt: x.createdAt?.toDate?.() };
  });
}

export async function updateLead(id: string, patch: { status?: LeadStatus; notes?: string }) {
  const [fs, db] = await Promise.all([fsLite(), getDb()]);
  await fs.updateDoc(fs.doc(db, "leads", id), { ...patch, updatedAt: fs.serverTimestamp() });
}

export async function deleteLead(id: string) {
  const [fs, db] = await Promise.all([fsLite(), getDb()]);
  await fs.deleteDoc(fs.doc(db, "leads", id));
}
