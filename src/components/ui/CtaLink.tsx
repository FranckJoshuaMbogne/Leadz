import type { ComponentProps } from "react";
import { ButtonA, ButtonLink } from "@/components/ui/Button";

/** Button for an admin-editable link: internal paths use the router, URLs open in a new tab. */
export function CtaLink({ href, children, ...rest }: { href: string; children: React.ReactNode } & Omit<ComponentProps<typeof ButtonLink>, "to" | "children">) {
  if (href.startsWith("/")) return <ButtonLink to={href} {...rest}>{children}</ButtonLink>;
  return (
    <ButtonA href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" variant={rest.variant} size={rest.size} className={rest.className} arrow={rest.arrow}>
      {children}
    </ButtonA>
  );
}

/** Renders "*gold*" markup: words between asterisks become gold. */
export function GoldText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? (
          <span key={i} className="text-gold-light">
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
