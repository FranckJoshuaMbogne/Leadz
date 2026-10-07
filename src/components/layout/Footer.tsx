import { Link } from "react-router-dom";
import { primaryNav, site } from "@/config/site";
import { pillars } from "@/data/services";
import { Logo } from "./Logo";
import { Arrow } from "@/components/ui/Button";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-deep text-ivory">
      <div className="container-site pt-section-sm">
        <div className="grid gap-14 border-b border-ivory/10 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" aria-label={`${site.name} — home`} className="inline-block">
              <Logo />
            </Link>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ivory/70">
              A 360° growth agency. We connect strategy, marketing, technology, AI and data into one system that helps
              ambitious businesses attract, convert and retain customers.
            </p>
            <Link
              to="/book"
              className="group/btn mt-8 inline-flex items-center gap-3 border-b border-gold/60 pb-1 text-[0.95rem] text-ivory hover:border-gold"
            >
              Book a Strategy Call <Arrow />
            </Link>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="eyebrow text-ivory/55">Explore</p>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {[...primaryNav, { to: "/contact", label: "Contact" }].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="link-underline text-ivory/80 hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-ivory/55">Capabilities</p>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {pillars.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/services/${p.slug}`} className="link-underline text-ivory/80 hover:text-ivory">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow text-ivory/55">Contact</p>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                <li>
                  <a href={site.contact.phoneHref} className="link-underline text-ivory/80 hover:text-ivory">
                    {site.contact.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="link-underline text-ivory/80 hover:text-ivory">
                    WhatsApp
                  </a>
                </li>
                {site.contact.email && (
                  <li>
                    <a href={`mailto:${site.contact.email}`} className="link-underline text-ivory/80 hover:text-ivory">
                      {site.contact.email}
                    </a>
                  </li>
                )}
                <li className="text-ivory/55">{site.contact.hours}</li>
                {site.social.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline text-ivory/80 hover:text-ivory">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-4 py-8 text-sm text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link to="/privacy" className="link-underline hover:text-ivory">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="link-underline hover:text-ivory">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap text-center font-display leading-[0.78] tracking-[-0.04em] text-ivory/[0.06]"
        style={{ fontSize: "clamp(4.5rem, 19vw, 19rem)" }}
      >
        Springs <span className="italic">360</span>
      </p>
    </footer>
  );
}
