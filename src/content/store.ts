import { getDb } from "@/lib/firebase";
import { site } from "@/config/site";
import { mergeContent } from "./defaults";
import type { Content } from "./types";

/** Reads every `content/*` document (one request) and merges over the defaults. */
export async function fetchLiveContent(): Promise<Content | null> {
  if (!site.cmsEnabled) return null;
  const [fs, db] = await Promise.all([import("firebase/firestore/lite"), getDb()]);
  const snap = await fs.getDocs(fs.collection(db, "content"));
  const docs: Record<string, Record<string, unknown>> = {};
  snap.forEach((d) => (docs[d.id] = d.data()));
  return mergeContent(docs);
}

const mediaCache = new Map<string, Promise<string>>();

/** Loads an uploaded image (stored as a data URL in `media/{id}`). */
export function fetchMedia(id: string): Promise<string> {
  if (!mediaCache.has(id)) {
    mediaCache.set(
      id,
      (async () => {
        const [fs, db] = await Promise.all([import("firebase/firestore/lite"), getDb()]);
        const snap = await fs.getDoc(fs.doc(db, "media", id));
        return (snap.data()?.data as string) ?? "";
      })()
    );
  }
  return mediaCache.get(id)!;
}
