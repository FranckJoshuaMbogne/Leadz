import { cn } from "@/lib/utils";

/** Ring mark: an almost-closed circle (the 360° journey) with a rising spring line. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden="true" focusable="false">
      <path d="M26.5 9.5A12 12 0 1 1 22 5.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="25.2" cy="7.3" r="1.9" fill="#B89B62" />
      <path d="M9 21c3-1 4.5-4 7-4s3.5 2 7-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-sans text-[0.95rem] font-semibold tracking-[0.22em]">
        SPRINGS<span className="ml-[0.35em] font-hero text-[1.15em] font-medium italic tracking-normal">360</span>
      </span>
    </span>
  );
}
