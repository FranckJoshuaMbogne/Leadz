import { Check, Inbox, Megaphone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Illustrative interface cards showing the kinds of work the agency runs
 * (scheduled posts, live campaigns, new enquiries, lead follow-up). They
 * contain no performance numbers or client names.
 */
function Card({ className, children, delay }: { className?: string; children: React.ReactNode; delay: string }) {
  return (
    <div
      className={cn("anim-fade-up absolute rounded-lg border border-ivory/15 bg-ivory p-4 text-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]", className)}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

export function HeroCollage({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative h-[480px] w-full", className)}>
      {/* Social post */}
      <Card className="left-[4%] top-0 w-[56%]" delay="0.45s">
        <div className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-forest to-gold" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">yourbrand</p>
            <p className="text-xs text-ink-soft">Scheduled · Tue 7:00 PM</p>
          </div>
        </div>
        <div className="mt-3 aspect-[16/10] overflow-hidden rounded-md bg-gradient-to-br from-sage-300 via-sage to-ivory-200">
          <div className="flex h-full items-end p-3">
            <span className="rounded-full bg-deep/85 px-2 py-1 text-xs font-medium text-ivory">New collection — now live</span>
          </div>
        </div>
        <div className="mt-3 h-2 w-3/4 rounded-full bg-ink/10" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-ink/10" />
      </Card>

      {/* Ad campaign */}
      <Card className="right-0 top-[10%] w-[42%]" delay="0.6s">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Megaphone size={16} className="text-forest" /> Campaign
        </div>
        <p className="mt-2 text-xs text-ink-soft">Meta Ads · Google Ads</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-500/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-forest-500" />
          </span>
          <span className="text-sm font-medium text-forest">Live</span>
        </div>
      </Card>

      {/* Lead routed */}
      <Card className="bottom-[24%] right-0 w-[42%]" delay="0.75s">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Inbox size={16} className="text-forest" /> Lead assigned
        </div>
        <ul className="mt-3 space-y-1.5 text-xs text-ink-muted">
          <li className="flex items-center gap-2">
            <Check size={14} className="text-forest" /> Added to CRM
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-forest" /> Follow-up scheduled
          </li>
        </ul>
      </Card>

      {/* WhatsApp enquiry */}
      <Card className="bottom-0 left-0 w-[54%]" delay="0.9s">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MessageCircle size={16} className="text-[#1f9d55]" /> New enquiry
        </div>
        <p className="mt-2 rounded-md bg-sage-100 px-3 py-2 text-sm">Hi! I'd like a quote for next month.</p>
        <p className="ml-auto mt-2 w-fit rounded-md bg-forest px-3 py-2 text-sm text-ivory">Thanks! Sharing details now.</p>
      </Card>
    </div>
  );
}
