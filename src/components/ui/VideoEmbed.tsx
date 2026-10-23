/** Plays an .mp4/.webm link, or embeds YouTube / Vimeo / Google Drive links. */
export function embedUrl(src: string) {
  const yt = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/.exec(src);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`;
  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/.exec(src);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  const drive = /drive\.google\.com\/file\/d\/([\w-]+)/.exec(src);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return null;
}

export function VideoEmbed({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const embed = embedUrl(src);
  if (embed) {
    return (
      <iframe
        src={embed}
        title={title}
        className="aspect-video w-full bg-black"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return <video src={src} poster={poster || undefined} controls playsInline preload="metadata" className="aspect-video w-full bg-black object-cover" aria-label={title} />;
}
