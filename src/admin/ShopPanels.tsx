import { useEffect, useMemo, useState } from "react";
import { Ban, Check, Copy, KeyRound, Loader2, MessageCircle, RefreshCw, RotateCcw, Search, Trash2, X } from "lucide-react";
import { useContent } from "@/content/ContentProvider";
import { money } from "@/landing/ui";
import type { Order, OrderStatus, ShopConfig } from "@/landing/types";
import { cn } from "@/lib/utils";
import { FieldsForm, inputCls, type Field } from "./fields";
import { deleteOrder, issuePassword, learnerPhones, listCoursesAdmin, listKeys, listOrders, loadShopAdmin, revokeKey, restoreKey, saveShop, setOrderStatus, type AccessKey, type CourseWithLessons } from "./landingApi";

/* ------------------------------------------------------------------ */
/* Payment methods                                                     */
/* ------------------------------------------------------------------ */

const shopFields: Field[] = [
  {
    k: "methods",
    label: "Payment methods",
    type: "list",
    addLabel: "Add payment method",
    hint: "Only methods ticked “Show at checkout” are offered. Learners see these details in a pop-up after choosing the method.",
    itemTitle: (m) => `${m.enabled ? "✓" : "○"} ${m.label}`,
    newItem: () => ({ id: `m${Math.random().toString(36).slice(2, 7)}`, label: "", kind: "other", enabled: false, instructions: "", payeeLabel: "", payeeValue: "", qr: "", link: "", linkLabel: "" }),
    fields: [
      { k: "enabled", label: "Show at checkout", type: "bool" },
      { k: "label", label: "Name shown to buyers", type: "text" },
      {
        k: "kind",
        label: "Icon",
        type: "select",
        options: [
          { value: "upi", label: "UPI / QR" },
          { value: "gpay", label: "Google Pay / phone" },
          { value: "card", label: "Card" },
          { value: "applepay", label: "Apple Pay" },
          { value: "paypal", label: "PayPal" },
          { value: "bank", label: "Bank transfer" },
          { value: "other", label: "Other" },
        ],
      },
      { k: "payeeLabel", label: "Pay-to label", type: "text", placeholder: "UPI ID" },
      { k: "payeeValue", label: "Pay-to value (copy button)", type: "text", placeholder: "springs360@okaxis", hint: "UPI ID, phone number, PayPal email or account number." },
      { k: "qr", label: "QR code image", type: "image", maxSide: 900 },
      { k: "link", label: "Payment link (optional)", type: "url", hint: "Razorpay / Stripe payment link for cards and Apple Pay, or paypal.me/yourname." },
      { k: "linkLabel", label: "Payment link button text", type: "text" },
      { k: "instructions", label: "Instructions (one step per line)", type: "textarea" },
    ],
  },
  { k: "confirmTitle", label: "“I've paid” pop-up title", type: "text" },
  { k: "confirmText", label: "“I've paid” pop-up text", type: "textarea" },
  { k: "afterText", label: "Message after submitting payment details", type: "textarea" },
  { k: "unlockText", label: "Text above the password box (My courses page)", type: "textarea" },
];

export function PaymentsPanel() {
  const content = useContent();
  const [shop, setShop] = useState<ShopConfig | null>(null);
  const [base, setBase] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    loadShopAdmin()
      .then(({ shop, saved }) => {
        setShop(shop);
        setBase(saved ? JSON.stringify(shop) : "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load payment settings."));
  }, []);
  const dirty = shop ? JSON.stringify(shop) !== base : false;

  async function save() {
    if (!shop) return;
    const bad = shop.methods.find((m) => m.enabled && !m.payeeValue && !m.link && !m.qr);
    if (bad) return setMsg({ ok: false, text: `“${bad.label}” is switched on but has no pay-to value, QR code or link.` });
    setBusy(true);
    setMsg(null);
    try {
      await saveShop(shop);
      setBase(JSON.stringify(shop));
      setMsg({ ok: true, text: "Saved. Checkout uses these details now." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? `Could not save: ${e.message}` : "Could not save." });
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>;
  if (!shop)
    return (
      <p className="flex items-center gap-2 text-ink-soft">
        <Loader2 size={18} className="animate-spin" /> Loading…
      </p>
    );
  return (
    <div className="pb-24">
      <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <FieldsForm fields={shopFields} value={shop} onChange={(v) => setShop(v as ShopConfig)} content={content} />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur lg:pl-[17rem]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          {msg ? <p className={cn("text-sm font-semibold", msg.ok ? "text-emerald-700" : "text-[#9B2C2C]")}>{msg.text}</p> : <p className="text-sm text-ink-muted">{dirty ? "You have unsaved changes." : "No changes."}</p>}
          <button type="button" onClick={save} disabled={busy} className="ml-auto inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-sm font-semibold text-ivory hover:bg-deep disabled:opacity-60">
            {busy && <Loader2 size={15} className="animate-spin" />} Save payment settings
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Orders & passwords                                                  */
/* ------------------------------------------------------------------ */

const statusCls: Record<OrderStatus, string> = {
  pending: "bg-gold/25 text-gold-dark",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};
const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const digits = (p?: string) => (p ?? "").replace(/\D/g, "");
const waNumber = (p?: string) => {
  const d = digits(p);
  return d.length === 10 ? `91${d}` : d;
};

function accessMessage(name: string, course: string, email: string, key: string) {
  return `Hi ${name.split(" ")[0]}, your payment for "${course}" is confirmed. 🎉

To watch:
1. Open https://springs360.in/learn
2. Sign in with Google: ${email}
3. Enter your password: ${key}

Inside the course you'll also find the link to the private course group.

This password works only with ${email}. Enjoy the course!
— Springs 360`;
}

function KeyBox({ k, email, name, phone, course }: { k: string; email: string; name: string; phone: string; course: string }) {
  const [copied, setCopied] = useState("");
  const msg = accessMessage(name, course, email, k);
  const copy = async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      /* select manually */
    }
  };
  return (
    <div className="grid gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Access password</p>
      <p className="select-all break-all font-mono text-xl font-bold tracking-wider text-ink">{k}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => copy("key", k)} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-2 text-sm font-semibold">
          <Copy size={14} /> {copied === "key" ? "Copied" : "Copy password"}
        </button>
        <button type="button" onClick={() => copy("msg", msg)} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-2 text-sm font-semibold">
          <Copy size={14} /> {copied === "msg" ? "Copied" : "Copy message"}
        </button>
        {digits(phone) && (
          <a href={`https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#1F8F55] px-3 py-2 text-sm font-semibold text-white">
            <MessageCircle size={15} /> Send on WhatsApp
          </a>
        )}
        <a href={`mailto:${email}?subject=${encodeURIComponent(`Your access to ${course}`)}&body=${encodeURIComponent(msg)}`} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-2 text-sm font-semibold">
          Email it
        </a>
      </div>
    </div>
  );
}

export function OrdersPanel({ onCount }: { onCount: (n: number) => void }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [courses, setCourses] = useState<CourseWithLessons[]>([]);
  const [learners, setLearners] = useState<Map<string, { name: string; phone: string }>>(new Map());
  const [filter, setFilter] = useState<OrderStatus | "all">("pending");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [manual, setManual] = useState({ email: "", course: "", name: "", phone: "" });
  const [manualKey, setManualKey] = useState<string | null>(null);

  async function refresh() {
    setError("");
    try {
      const [o, k, c, l] = await Promise.all([listOrders(), listKeys(), listCoursesAdmin(), learnerPhones()]);
      setOrders(o);
      setKeys(k);
      setCourses(c);
      setLearners(l);
      onCount(o.filter((x) => x.status === "pending").length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders. Deploy the latest firestore.rules.");
    }
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (orders ?? []).filter((o) => (filter === "all" || o.status === filter) && (!t || [o.email, o.payerName, o.payerPhone, o.phone, o.txnRef, o.courseTitle].some((v) => v?.toLowerCase().includes(t))));
  }, [orders, filter, q]);

  async function approve(o: Order) {
    setBusy(o.id);
    try {
      await issuePassword({ email: o.email, courseSlug: o.courseSlug, orderId: o.id });
      await refresh();
      setOpen(o.id);
    } catch {
      setError("Could not approve. Check your admin access.");
    } finally {
      setBusy("");
    }
  }
  async function reject(o: Order) {
    const note = window.prompt("Reason (private note, optional):", o.note ?? "") ?? undefined;
    setBusy(o.id);
    try {
      await setOrderStatus(o.id, "rejected", note);
      await refresh();
    } finally {
      setBusy("");
    }
  }
  async function toggleKey(k: AccessKey) {
    if (!k.revoked && !window.confirm("Turn this password off? The learner loses access to the course.")) return;
    setBusy(k.id);
    try {
      if (k.revoked) await restoreKey(k.id);
      else await revokeKey(k.id);
      await refresh();
    } finally {
      setBusy("");
    }
  }

  const counts = (s: OrderStatus) => (orders ?? []).filter((o) => o.status === s).length;
  const courseTitle = (slug: string) => courses.find((c) => c.slug === slug)?.title ?? slug;

  return (
    <div className="grid gap-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize", filter === f ? "bg-forest text-ivory" : "bg-white text-ink hover:bg-ink/5")}>
              {f === "pending" ? "To verify" : f}
              {f !== "all" && orders && <span className="ml-1.5 opacity-70">{counts(f)}</span>}
            </button>
          ))}
          <div className="relative ml-auto">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, phone, txn ID…" className="h-9 w-52 rounded-full border border-ink/15 bg-white pl-8 pr-3 text-sm focus:border-forest focus:outline-none" />
          </div>
          <button type="button" onClick={refresh} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 text-sm font-semibold hover:border-ink">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {!orders && !error && <p className="mt-8 text-center text-ink-soft">Loading orders…</p>}
        {orders && shown.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">Nothing here.</p>}
        <ul className="mt-5 space-y-3">
          {shown.map((o) => {
            const key = keys.find((k) => k.orderId === o.id);
            const learner = learners.get(o.uid);
            const isOpen = open === o.id;
            return (
              <li key={o.id} className="rounded-2xl border border-ink/10 bg-white">
                <button type="button" onClick={() => setOpen(isOpen ? null : o.id)} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-left">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold capitalize", statusCls[o.status])}>{o.status === "pending" ? "To verify" : o.status}</span>
                  <span className="font-semibold text-ink">{o.payerName}</span>
                  <span className="text-sm text-ink-muted">
                    {money(o.amount, o.currency)} · {o.methodLabel} · {o.courseTitle}
                  </span>
                  <span className="ml-auto text-xs text-ink-soft">{o.createdAt ? fmt.format(o.createdAt) : ""}</span>
                </button>
                {isOpen && (
                  <div className="grid gap-5 border-t border-ink/10 p-4 lg:grid-cols-[1fr_1fr]">
                    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      {[
                        ["Paid by (name)", o.payerName],
                        ["Paid from (phone)", o.payerPhone],
                        ["Transaction ID", o.txnRef || "—"],
                        ["Amount", `${money(o.amount, o.currency)} via ${o.methodLabel}`],
                        ["Google email", o.email],
                        ["Learner phone", o.phone || learner?.phone],
                        ["Course", o.courseTitle],
                        ["Note", o.note],
                      ]
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <div key={k as string}>
                            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{k}</dt>
                            <dd className="break-words text-ink">{v}</dd>
                          </div>
                        ))}
                    </dl>
                    <div className="grid h-fit gap-3">
                      {o.status === "pending" && (
                        <>
                          <p className="text-sm text-ink-muted">Check your {o.methodLabel} account for a payment of {money(o.amount, o.currency)} from this name or phone. Then:</p>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" disabled={busy === o.id} onClick={() => approve(o)} className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-ivory hover:bg-deep disabled:opacity-60">
                              {busy === o.id ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Payment received · create password
                            </button>
                            <button type="button" disabled={busy === o.id} onClick={() => reject(o)} className="inline-flex items-center gap-1.5 rounded-full border border-[#9B2C2C]/30 px-4 py-2 text-sm font-semibold text-[#9B2C2C]">
                              <X size={15} /> Not found
                            </button>
                          </div>
                        </>
                      )}
                      {key && <KeyBox k={key.id} email={o.email} name={o.payerName} phone={o.phone || o.payerPhone} course={o.courseTitle} />}
                      {key && (
                        <button type="button" onClick={() => toggleKey(key)} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#9B2C2C] hover:underline">
                          {key.revoked ? <RotateCcw size={14} /> : <Ban size={14} />} {key.revoked ? "Turn password back on" : "Turn password off (remove access)"}
                        </button>
                      )}
                      {o.status !== "pending" && !key && o.status === "rejected" && (
                        <button type="button" onClick={() => approve(o)} className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-forest hover:underline">
                          <Check size={14} /> Approve after all
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm("Delete this order record? The password (if any) keeps working.")) return;
                          await deleteOrder(o.id);
                          refresh();
                        }}
                        className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-ink-soft hover:underline"
                      >
                        <Trash2 size={13} /> Delete order record
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <section className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <KeyRound size={18} /> Give access without an order
        </h2>
        <p className="mt-1 text-sm text-ink-muted">For cash payments, gifts or team members. The password only works with this Google email.</p>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(manual.email.trim()) || !manual.course) return setError("Enter a Google email and choose a course.");
            setError("");
            setBusy("manual");
            try {
              setManualKey(await issuePassword({ email: manual.email, courseSlug: manual.course }));
              refresh();
            } finally {
              setBusy("");
            }
          }}
        >
          <input className={inputCls} type="email" placeholder="Learner's Google email" value={manual.email} onChange={(e) => setManual({ ...manual, email: e.target.value })} />
          <select className={inputCls} value={manual.course} onChange={(e) => setManual({ ...manual, course: e.target.value })}>
            <option value="">Choose a course</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
          <input className={inputCls} placeholder="Name (for the message)" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} />
          <input className={inputCls} type="tel" placeholder="WhatsApp number (for the message)" value={manual.phone} onChange={(e) => setManual({ ...manual, phone: e.target.value })} />
          <button type="submit" disabled={busy === "manual"} className="inline-flex w-fit items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-deep disabled:opacity-60">
            {busy === "manual" && <Loader2 size={15} className="animate-spin" />} Create password
          </button>
        </form>
        {manualKey && (
          <div className="mt-4">
            <KeyBox k={manualKey} email={manual.email.trim().toLowerCase()} name={manual.name || "there"} phone={manual.phone} course={courseTitle(manual.course)} />
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-ink">All passwords</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-4 py-3">Password</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {keys.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink-soft">
                    No passwords yet.
                  </td>
                </tr>
              )}
              {keys.map((k) => (
                <tr key={k.id} className={k.revoked ? "opacity-50" : ""}>
                  <td className="px-4 py-3 font-mono font-semibold">{k.id}</td>
                  <td className="px-4 py-3">{k.email}</td>
                  <td className="px-4 py-3">{courseTitle(k.courseSlug)}</td>
                  <td className="px-4 py-3 tabular-nums">{k.createdAt ? fmt.format(k.createdAt) : ""}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" disabled={busy === k.id} onClick={() => toggleKey(k)} className="text-sm font-semibold text-forest hover:underline">
                      {k.revoked ? "Turn on" : "Turn off"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
