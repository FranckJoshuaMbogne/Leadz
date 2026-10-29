import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, CreditCard, ExternalLink, Globe, Landmark, Loader2, QrCode, Smartphone, Wallet } from "lucide-react";
import { useContact, useMedia } from "@/content/ContentProvider";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { createOrder, fetchShop, learnerSignIn, loadProfile, myGrants, saveProfile } from "./api";
import { authErrorMessage, useLearner } from "./useLearner";
import { Modal, lpBtn, lpBtnDark, lpInput, money } from "./ui";
import type { Course, PayMethod, ShopConfig } from "./types";

const icons = { upi: QrCode, gpay: Smartphone, card: CreditCard, applepay: Smartphone, paypal: Globe, bank: Landmark, other: Wallet } as const;

/** Instagram / Facebook / other in-app browsers block Google sign-in pop-ups. */
function inAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return /FBAN|FBAV|Instagram|Line\/|LinkedInApp|Snapchat|\bwv\)/i.test(navigator.userAgent);
}

function CopyValue({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          window.setTimeout(() => setOk(false), 1600);
        } catch {
          /* select manually */
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm font-semibold text-ink hover:border-ink"
    >
      {ok ? <Check size={14} /> : <Copy size={14} />} {ok ? "Copied" : "Copy"}
    </button>
  );
}

function Qr({ src }: { src: string }) {
  const url = useMedia(src);
  return url ? <img src={url} alt="Payment QR code" className="mx-auto w-56 max-w-full rounded-xl border border-ink/10 bg-white p-2" /> : null;
}

type Step = "signin" | "profile" | "method" | "pay" | "confirm" | "done" | "owned";

export function Checkout({ course, onClose }: { course: Course; onClose: () => void }) {
  const learner = useLearner(true);
  const contact = useContact();
  const [shop, setShop] = useState<ShopConfig | null>(null);
  const [step, setStep] = useState<Step>("signin");
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [payer, setPayer] = useState({ name: "", phone: "", ref: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const user = learner.status === "signed-in" ? learner.user : null;

  useEffect(() => {
    fetchShop().then(setShop);
    track("begin_checkout", { course: course.slug, value: course.price });
  }, [course.slug, course.price]);

  // After sign-in: owned? profile complete?
  useEffect(() => {
    if (!user) {
      if (learner.status === "signed-out") setStep("signin");
      return;
    }
    let off = false;
    (async () => {
      const [grants, p] = await Promise.all([myGrants(user.uid).catch(() => []), loadProfile(user.uid)]);
      if (off) return;
      if (grants.some((g) => g.courseSlug === course.slug)) return setStep("owned");
      const name = p?.name || user.displayName || "";
      const phone = p?.phone || "";
      setProfile({ name, phone });
      setPayer({ name, phone, ref: "" });
      setStep(p?.phone ? "method" : "profile");
    })();
    return () => {
      off = true;
    };
  }, [user, learner.status, course.slug]);

  async function signIn() {
    setErr("");
    setBusy(true);
    try {
      await learnerSignIn();
    } catch (e) {
      setErr(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function saveP(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (profile.name.trim().length < 2) return setErr("Please enter your name.");
    if (profile.phone.replace(/\D/g, "").length < 10) return setErr("Enter a phone number with at least 10 digits, e.g. +91 98765 43210.");
    setErr("");
    setBusy(true);
    try {
      await saveProfile(user.uid, { name: profile.name.trim(), email: user.email ?? "", phone: profile.phone.trim() });
      setPayer({ name: profile.name.trim(), phone: profile.phone.trim(), ref: "" });
      setStep("method");
    } catch {
      setErr("We couldn't save that. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function confirm(e: FormEvent) {
    e.preventDefault();
    if (!user || !method) return;
    if (payer.name.trim().length < 2) return setErr("Enter the name used for the payment.");
    if (payer.phone.replace(/\D/g, "").length < 10) return setErr("Enter the phone number used for the payment (at least 10 digits).");
    setErr("");
    setBusy(true);
    try {
      await createOrder({
        uid: user.uid,
        email: user.email ?? "",
        phone: profile.phone.trim(),
        courseSlug: course.slug,
        courseTitle: course.title,
        amount: course.price,
        currency: course.currency || "INR",
        method: method.id,
        methodLabel: method.label,
        payerName: payer.name.trim(),
        payerPhone: payer.phone.trim(),
        txnRef: payer.ref.trim(),
      });
      setStep("done");
    } catch {
      setErr("We couldn't send that. Please try again, or message us on WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  const price = money(course.price, course.currency);
  const methods = (shop?.methods ?? []).filter((m) => m.enabled);
  const title = step === "pay" && method ? `Pay with ${method.label}` : step === "confirm" ? shop?.confirmTitle || "Confirm your payment" : `Get ${course.title}`;

  return (
    <Modal title={title} onClose={onClose}>
      <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-sage-100 px-4 py-3">
        <span className="min-w-0 truncate text-sm font-semibold text-ink">{course.title}</span>
        <span className="shrink-0 text-lg font-extrabold tabular-nums text-ink">{price}</span>
      </div>

      {learner.status === "loading" ? (
        <p className="flex items-center gap-2 text-ink-soft">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </p>
      ) : step === "signin" ? (
        <div className="grid gap-4">
          <p className="text-ink-muted">Sign in with Google so we can link the course to your email. You'll use this email with your password to watch.</p>
          {inAppBrowser() && (
            <p className="rounded-xl bg-gold/15 p-3 text-sm text-ink">
              Google sign-in doesn't work inside Instagram or Facebook. Tap <b>⋯</b> at the top and choose <b>Open in browser</b>, then continue there.
            </p>
          )}
          <button type="button" onClick={signIn} disabled={busy} className="flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-ink/15 bg-white font-semibold text-ink hover:border-ink disabled:opacity-60">
            {busy ? <Loader2 size={18} className="animate-spin" /> : <GoogleMark />} Continue with Google
          </button>
        </div>
      ) : step === "owned" ? (
        <div className="grid gap-4">
          <p className="text-ink">You already have access to this course.</p>
          <Link to={`/learn/${course.slug}`} className={lpBtnDark}>
            Watch now
          </Link>
        </div>
      ) : step === "profile" ? (
        <form onSubmit={saveP} noValidate className="grid gap-4">
          <p className="text-sm text-ink-muted">
            Signed in as <b className="text-ink">{user?.email}</b>
          </p>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Your name
            <input id="co-name" className={lpInput} autoComplete="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Phone number (WhatsApp)
            <input id="co-phone" className={lpInput} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98xxx xxxxx" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
          </label>
          <button type="submit" disabled={busy} className={lpBtn}>
            {busy && <Loader2 size={18} className="animate-spin" />} Continue to payment
          </button>
        </form>
      ) : step === "method" ? (
        <div className="grid gap-3">
          <p className="text-sm text-ink-muted">Choose how you'd like to pay.</p>
          {!shop ? (
            <Loader2 className="animate-spin text-ink-soft" />
          ) : methods.length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-ink">
              Online payment opens soon. Message us on WhatsApp at <b>{contact.phoneDisplay}</b> to buy this course now.
            </p>
          ) : (
            methods.map((m) => {
              const Icon = icons[m.kind] ?? Wallet;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMethod(m);
                    setStep("pay");
                    track("add_payment_info", { course: course.slug, method: m.id });
                  }}
                  className="flex items-center gap-4 rounded-2xl border-[1.5px] border-ink/10 bg-white px-5 py-4 text-left text-lg font-semibold text-ink transition-colors hover:border-forest-500"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 text-forest">
                    <Icon size={20} />
                  </span>
                  {m.label}
                </button>
              );
            })
          )}
        </div>
      ) : step === "pay" && method ? (
        <div className="grid gap-5">
          <div className="text-center">
            <p className="eyebrow text-ink-soft">Amount to pay</p>
            <p className="mt-2 text-4xl font-extrabold tabular-nums text-ink">{price}</p>
          </div>
          {method.qr && <Qr src={method.qr} />}
          {method.payeeValue && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-4">
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">{method.payeeLabel || "Pay to"}</span>
                <span className="block select-all break-all text-lg font-bold text-ink">{method.payeeValue}</span>
              </span>
              <CopyValue value={method.payeeValue} />
            </div>
          )}
          {method.link && (
            <a href={method.link} target="_blank" rel="noopener noreferrer" className={lpBtnDark}>
              {method.linkLabel || "Open payment page"} <ExternalLink size={16} />
            </a>
          )}
          {method.instructions.trim() && (
            <ol className="grid gap-2.5">
              {method.instructions
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i} className="flex gap-3 text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-ivory">{i + 1}</span>
                    <span>{line}</span>
                  </li>
                ))}
            </ol>
          )}
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <button type="button" className={cn(lpBtn, "flex-1")} onClick={() => setStep("confirm")}>
              I've paid
            </button>
            <button type="button" className="min-h-[48px] rounded-full px-5 font-semibold text-ink-muted hover:text-ink" onClick={() => setStep("method")}>
              Choose another method
            </button>
          </div>
        </div>
      ) : step === "confirm" ? (
        <form onSubmit={confirm} noValidate className="grid gap-4">
          <p className="text-ink-muted">{shop?.confirmText}</p>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Name used to pay
            <input id="co-payer" className={lpInput} value={payer.name} onChange={(e) => setPayer((p) => ({ ...p, name: e.target.value }))} />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Phone number used to pay
            <input id="co-payer-phone" className={lpInput} type="tel" inputMode="tel" value={payer.phone} onChange={(e) => setPayer((p) => ({ ...p, phone: e.target.value }))} />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Transaction ID <span className="font-normal text-ink-soft">(optional, speeds up verification)</span>
            <input id="co-ref" className={lpInput} value={payer.ref} onChange={(e) => setPayer((p) => ({ ...p, ref: e.target.value }))} />
          </label>
          <button type="submit" disabled={busy} className={lpBtn}>
            {busy && <Loader2 size={18} className="animate-spin" />} Submit payment details
          </button>
          <button type="button" className="text-sm font-semibold text-ink-muted hover:text-ink" onClick={() => setStep("pay")}>
            ← Back to payment instructions
          </button>
        </form>
      ) : step === "done" ? (
        <div className="grid gap-4 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-200 text-forest">
            <Check size={28} />
          </span>
          <p className="text-ink">{shop?.afterText}</p>
          <p className="text-sm text-ink-muted">
            When you receive your password, open <b className="text-ink">My courses</b> and sign in with <b className="text-ink">{user?.email}</b>.
          </p>
          <Link to="/learn" className={lpBtnDark}>
            Go to My courses
          </Link>
        </div>
      ) : null}

      {err && (
        <p role="alert" className="mt-4 text-sm text-[#9B2C2C]">
          {err}
        </p>
      )}
    </Modal>
  );
}

export function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
