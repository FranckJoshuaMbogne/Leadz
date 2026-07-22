import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ui/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass" : "bg-transparent border-b border-transparent"
      )}
    >
      <Container className="relative flex h-16 items-center justify-between md:h-20">
        <NavLink
          to="/"
          className="font-display text-lg font-bold text-ink md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2"
        >
          LeadZ<span className="text-gradient">.in</span>
        </NavLink>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-ink" : "text-silver hover:text-ink"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center md:flex">
          <ThemeToggle />
          <NavLink to="/contact">
            <Button size="md" className="ml-3">Book a Call</Button>
          </NavLink>
        </div>

        <button
          aria-label="Toggle menu"
          className="text-ink md:hidden absolute right-4"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass md:hidden overflow-hidden"
          >
            <Container className="flex flex-col gap-4 py-6">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-silver hover:text-ink"
                >
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/contact">
                <Button className="w-full">Book a Call</Button>
              </NavLink>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
