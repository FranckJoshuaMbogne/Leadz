import { CoverArt, type ArtTone, type ArtVariant } from "./CoverArt";
import { useMedia } from "@/content/ContentProvider";

/** Uploaded image when set, otherwise the generated cover art. */
export function Cover({ image, seed, variant, tone }: { image?: string; seed: string; variant: ArtVariant; tone?: ArtTone }) {
  const url = useMedia(image);
  if (url) return <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />;
  return <CoverArt seed={seed} variant={variant} tone={tone} />;
}
