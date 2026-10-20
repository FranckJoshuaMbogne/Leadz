import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const HIDDEN_ON = ["/book", "/contact", "/thank-you"];

/**
 * Mobile: a bottom bar with the two primary actions, shown after the visitor
 * scrolls past the first screen. Desktop: a discreet WhatsApp button.
 */
export function StickyCta() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-deep/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 ease-editorial md:hidden",
          show ? "translate-y-0" : "translate-y-full"
        )}
        aria-hidden={!show}
      >
        <div className="flex gap-3">
          <Link
            to="/book"
            tabIndex={show ? 0 : -1}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-ivory px-4 text-[0.95rem] font-semibold text-deep"
          >
            Get a Free Strategy Call
          </Link>
          <a
            href={site.contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={show ? 0 : -1}
            aria-label="Chat on WhatsApp"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ivory/30 text-ivory"
          >
            <MessageCircle size={22} />
          </a>
        </div>
      </div>

      <a
        href={site.contact.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={cn(
          "fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-forest text-ivory shadow-soft transition-[opacity,transform] duration-300 hover:bg-deep md:flex",
          show ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        )}
        tabIndex={show ? 0 : -1}
      >
        <MessageCircle size={24} />
      </a>
    </>
  );
}
