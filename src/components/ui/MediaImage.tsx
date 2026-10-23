import { useMedia } from "@/content/ContentProvider";

/** <img> for an admin image value ("media:…", "/path" or "https://…"). Renders nothing when empty. */
export function MediaImage({ src, alt = "", className, eager }: { src?: string; alt?: string; className?: string; eager?: boolean }) {
  const url = useMedia(src);
  if (!url) return null;
  return <img src={url} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" />;
}
