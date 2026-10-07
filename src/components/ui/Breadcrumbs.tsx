import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items, light = false, className }: { items: { name: string; path: string }[]; light?: boolean; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={light ? "text-ivory/90" : "text-ink"}>
                  {it.name}
                </span>
              ) : (
                <>
                  <Link to={it.path} className={cn("link-underline", light ? "text-ivory/65 hover:text-ivory" : "text-ink-muted hover:text-ink")}>
                    {it.name}
                  </Link>
                  <span aria-hidden="true" className={light ? "text-ivory/40" : "text-ink/30"}>
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
