import { Link, type LinkProps } from "react-router-dom";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "light" | "outline" | "outline-light" | "text" | "text-light";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex min-h-[48px] items-center justify-center gap-3 rounded-sm font-sans font-medium tracking-[0.01em] transition-[background-color,color,border-color] duration-200 ease-editorial disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-ivory hover:bg-deep",
  light: "bg-ivory text-deep hover:bg-sage",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.03]",
  "outline-light": "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory/[0.06]",
  text: "min-h-[44px] px-0 text-ink",
  "text-light": "min-h-[44px] px-0 text-ivory",
};

const sizes: Record<Size, string> = {
  md: "px-6 text-[0.95rem]",
  lg: "px-7 text-base sm:px-8",
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 12"
      width="20"
      height="12"
      aria-hidden="true"
      className={cn("shrink-0 transition-transform duration-200 ease-editorial group-hover/btn:translate-x-1 group-focus-visible/btn:translate-x-1", className)}
    >
      <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function classes(variant: Variant, size: Size, className?: string) {
  const isText = variant === "text" || variant === "text-light";
  return cn(base, variants[variant], !isText && sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}

export function ButtonLink({ variant = "primary", size = "md", arrow = true, children, className, ...rest }: CommonProps & LinkProps) {
  const isText = variant === "text" || variant === "text-light";
  return (
    <Link className={classes(variant, size, className)} {...rest}>
      <span className={cn(isText && "link-underline pb-0.5")}>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

export function ButtonA({
  variant = "primary",
  size = "md",
  arrow = true,
  children,
  className,
  ...rest
}: CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes(variant, size, className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </a>
  );
}

export const Button = forwardRef<HTMLButtonElement, CommonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ variant = "primary", size = "md", arrow = true, children, className, ...rest }, ref) => (
    <button ref={ref} className={classes(variant, size, className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  )
);
Button.displayName = "Button";
