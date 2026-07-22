import type { ServiceDetail } from "@/data/services";

export function ServiceJumpNav({ services }: { services: ServiceDetail[] }) {
  return (
    <div className="sticky top-16 z-30 border-b border-white/[0.06] bg-base/80 backdrop-blur-lg md:top-20">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden">
        {services.map((s) => (
          <a
            key={s.slug}
            href={`#${s.slug}`}
            className="shrink-0 whitespace-nowrap rounded-pill px-3.5 py-1.5 text-xs font-medium text-silver transition-colors hover:bg-white/[0.06] hover:text-ink"
          >
            {s.title}
          </a>
        ))}
      </div>
    </div>
  );
}
