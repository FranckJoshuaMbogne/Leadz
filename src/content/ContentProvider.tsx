import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultContent } from "./defaults";
import type { Content } from "./types";
import { fetchLiveContent, fetchMedia } from "./store";

interface Ctx {
  content: Content;
  /** Uploaded images already exported as files by the last build. */
  builtMedia: string[];
  /** True once the latest content has been fetched (or fetching failed). */
  ready: boolean;
}

const ContentContext = createContext<Ctx>({ content: defaultContent, builtMedia: [], ready: true });

export interface InitialContent {
  content: Content;
  builtMedia: string[];
}

/**
 * Pages render with the content embedded at build time (so hydration
 * matches), then refresh with the latest content from Firestore — admin
 * changes appear immediately, without a rebuild.
 */
export function ContentProvider({ initial, live = true, children }: { initial?: InitialContent; live?: boolean; children: ReactNode }) {
  const [content, setContent] = useState<Content>(initial?.content ?? defaultContent);
  const [ready, setReady] = useState(!live);
  const builtMedia = initial?.builtMedia ?? [];

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    fetchLiveContent()
      .then((c) => {
        if (!cancelled && c) setContent(c);
      })
      .catch((err) => console.warn("Live content unavailable, using built-in content", err))
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, [live]);

  const value = useMemo(() => ({ content, builtMedia, ready }), [content, builtMedia, ready]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContentState() {
  return useContext(ContentContext);
}

export function useContent() {
  return useContext(ContentContext).content;
}

/** Contact details and links derived from /admin → Settings. */
export function useContact() {
  const { settings } = useContent();
  const digits = settings.phone.replace(/[^\d]/g, "");
  const wa = `https://wa.me/${digits}`;
  return {
    email: settings.email || null,
    phoneDisplay: settings.phoneDisplay,
    phoneHref: `tel:+${digits}`,
    whatsappHref: settings.whatsappText ? `${wa}?text=${encodeURIComponent(settings.whatsappText)}` : wa,
    whatsappBase: wa,
    address: settings.address || null,
    hours: settings.hours,
    social: settings.social.filter((s) => s.href),
  };
}

/** Resolves an image value ("media:id", "/path.jpg" or "https://…") to a usable src. */
export function useMedia(ref?: string | null): string {
  const { builtMedia } = useContentState();
  const id = ref?.startsWith("media:") ? ref.slice(6) : null;
  const built = id && builtMedia.includes(id) ? `/media/${id}` : null;
  const [src, setSrc] = useState<string>(id ? built ?? "" : ref ?? "");

  useEffect(() => {
    if (!id) {
      setSrc(ref ?? "");
      return;
    }
    if (built) {
      setSrc(built);
      return;
    }
    let ok = true;
    fetchMedia(id).then((d) => ok && setSrc(d)).catch(() => ok && setSrc(""));
    return () => {
      ok = false;
    };
  }, [id, ref, built]);

  return src;
}
