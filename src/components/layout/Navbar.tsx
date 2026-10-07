import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { primaryNav, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [location.pathname]);

  // Lock scroll, handle Escape and keep focus inside the open menu.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a,button"));
        const all = [toggleRef.current!, ...items];
        const idx = all.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          all[all.length - 1].focus();
        } else if (!e.shiftKey && idx === all.length - 1) {
          e.preventDefault();
          all[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color,height] duration-300 ease-editorial",
        solid ? "border-b border-ink/10 bg-ivory/95 text-ink backdrop-blur-md supports-[backdrop-filter]:bg-ivory/85" : "border-b border-transparent text-ivory"
      )}
    >
      <div className={cn("container-site flex items-center justify-between transition-[height] duration-300", solid ? "h-16" : "h-[72px] md:h-20")}>
        <Link to="/" aria-label={`${site.name} — home`} className="relative z-10 -ml-1 rounded-sm p-1">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "relative py-2 text-[0.95rem] transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-75 hover:opacity-100"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            to="/book"
            variant={solid ? "primary" : "light"}
            className="hidden min-h-[42px] px-5 text-sm md:inline-flex"
          >
            Book a Strategy Call
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-6">
              <span className={cn("absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300", open && "translate-y-1.5 rotate-45")} />
              <span className={cn("absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300", open && "-translate-y-1.5 -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="on-dark fixed inset-0 -z-0 flex flex-col overflow-y-auto bg-deep px-gutter pb-10 pt-28 text-ivory lg:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {[{ to: "/", label: "Home" }, ...primaryNav, { to: "/contact", label: "Contact" }].map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        cn("flex items-baseline gap-4 py-2 font-display text-[2.4rem] leading-tight xs:text-5xl", isActive ? "text-ivory" : "text-ivory/70")
                      }
                    >
                      <span className="font-sans text-xs tabular-nums text-gold-light">0{i + 1}</span>
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto space-y-6 pt-12">
              <ButtonLink to="/book" variant="light" size="lg" className="w-full">
                Book a Strategy Call
              </ButtonLink>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/70">
                <a href={site.contact.phoneHref} className="py-1">{site.contact.phoneDisplay}</a>
                <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="py-1">
                  WhatsApp
                </a>
                {site.contact.email && <a href={`mailto:${site.contact.email}`} className="py-1">{site.contact.email}</a>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
