import { useState, type FormEvent } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    // Wire this up to your email provider (Mailchimp, Klaviyo, etc.)
    setSubscribed(true);
    setEmail("");
  };

  if (subscribed) {
    return (
      <p className="flex items-center gap-2 text-sm text-ink">
        <CheckCircle2 size={16} className="text-electric" /> You're subscribed — watch for growth tips in your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          className="w-full rounded-pill border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-silver/50 focus:border-electric focus:outline-none"
        />
      </div>
      <Button type="submit" size="md">
        Subscribe
      </Button>
    </form>
  );
}
