import { NavLink } from "react-router-dom";
import { Linkedin, Instagram, Facebook, Twitter } from "lucide-react";
import { Container } from "./ui/Container";

const columns = [
  {
    title: "Company",
    links: [
      { label: "Home", to: "/" },
      { label: "Portfolio", to: "/portfolio" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Lead Generation", to: "/services#lead-generation" },
      { label: "Google Ads", to: "/services#google-ads" },
      { label: "Marketing Automation", to: "/services#marketing-automation" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-elevated">
      <Container className="grid gap-12 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-ink">Leadz.in</p>
          <p className="mt-3 max-w-xs text-sm text-silver">
            We turn ad spend into booked calls — predictably.
          </p>
          <div className="mt-5 flex gap-4 text-silver">
            <a href="#" aria-label="LinkedIn" className="hover:text-ink"><Linkedin size={18} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-ink"><Instagram size={18} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-ink"><Facebook size={18} /></a>
            <a href="#" aria-label="X" className="hover:text-ink"><Twitter size={18} /></a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-ink">{col.title}</p>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <NavLink to={l.to} className="text-sm text-silver hover:text-ink">
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/[0.08] py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-silver md:flex-row">
          <p>© {new Date().getFullYear()} Leadz.in. All rights reserved.</p>
          <p>Built for businesses that want predictable revenue.</p>
        </Container>
      </div>
    </footer>
  );
}
