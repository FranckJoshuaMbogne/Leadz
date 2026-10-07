import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export function FaqList({ faqs, light = false }: { faqs: { question: string; answer: string }[]; light?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <div className={cn("border-t", light ? "border-ivory/15" : "border-ink/15")}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.question} className={cn("border-b", light ? "border-ivory/15" : "border-ink/15")}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium"
              >
                {f.question}
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                  <span className={cn("absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-300", isOpen && "scale-y-0")} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-${i}`}
              role="region"
              hidden={!isOpen}
              className={cn("max-w-3xl pb-7", light ? "text-ivory/75" : "text-ink-muted")}
            >
              {f.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
