import { useEffect, useMemo, useState } from "react";
import { Calendar, Download, Globe, Mail, MessageCircle, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteLead as deleteRequest, loadLeads as loadRequests, updateLead as updateRequest, type Lead as ConsultationRequest, type LeadStatus as RequestStatus } from "./api";

const statuses: { value: RequestStatus; label: string; cls: string }[] = [
  { value: "new", label: "New", cls: "bg-gold/25 text-gold-dark" },
  { value: "contacted", label: "Contacted", cls: "bg-sky-100 text-sky-800" },
  { value: "qualified", label: "Qualified", cls: "bg-violet-100 text-violet-800" },
  { value: "won", label: "Won", cls: "bg-emerald-100 text-emerald-800" },
  { value: "closed", label: "Closed", cls: "bg-ink/10 text-ink-muted" },
  { value: "spam", label: "Spam", cls: "bg-red-100 text-red-800" },
];
const intentLabel = (r: ConsultationRequest) =>
  r.intent === "strategy-call" ? "Strategy call" : r.intent === "audit" ? `Audit · ${r.score ?? "?"}/100` : r.intent === "landing" ? `Landing page ${r.page ?? ""}` : "Contact form";
const statusCls = (s: RequestStatus) => statuses.find((x) => x.value === s)?.cls ?? "";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function csv(rows: ConsultationRequest[]) {
  const cols: (keyof ConsultationRequest)[] = ["createdAt", "intent", "status", "name", "email", "phone", "company", "website", "industry", "area", "score", "weakest", "source", "channels", "budget", "challenge", "outcome", "message", "notes", "page"];
  const esc = (v: unknown) => {
    const s = v instanceof Date ? v.toISOString() : Array.isArray(v) ? v.join("; ") : String(v ?? "");
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export function Leads({ onCount }: { onCount: (n: number) => void }) {
  const [rows, setRows] = useState<ConsultationRequest[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<RequestStatus | "all" | "active">("active");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  async function refresh() {
    setError("");
    try {
      const r = await loadRequests();
      setRows(r);
      onCount(r.filter((x) => x.status === "new").length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load leads");
    }
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (rows ?? [])
      .filter((r) => (filter === "all" ? true : filter === "active" ? r.status !== "closed" && r.status !== "spam" : r.status === filter))
      .filter((r) => !term || [r.name, r.email, r.company, r.message, r.outcome, r.phone].some((v) => v?.toLowerCase().includes(term)));
  }, [rows, filter, q]);

  async function setStatus(r: ConsultationRequest, status: RequestStatus) {
    setRows((rs) => rs!.map((x) => (x.id === r.id ? { ...x, status } : x)));
    try {
      await updateRequest(r.id, { status });
      onCount((rows ?? []).filter((x) => (x.id === r.id ? status : x.status) === "new").length);
    } catch {
      setError("Could not update the status.");
    }
  }
  async function saveNotes(r: ConsultationRequest, notes: string) {
    if ((r.notes ?? "") === notes) return;
    setRows((rs) => rs!.map((x) => (x.id === r.id ? { ...x, notes } : x)));
    try {
      await updateRequest(r.id, { notes });
    } catch {
      setError("Could not save the note.");
    }
  }
  async function remove(r: ConsultationRequest) {
    if (!window.confirm(`Delete the lead from ${r.name}? This can't be undone.`)) return;
    try {
      await deleteRequest(r.id);
      setRows((rs) => rs!.filter((x) => x.id !== r.id));
    } catch {
      setError("Could not delete.");
    }
  }
  function exportCsv() {
    const blob = new Blob([csv(shown)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `springs360-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const counts = (s: RequestStatus) => (rows ?? []).filter((r) => r.status === s).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: "active" as const, label: "Open" },
          ...statuses.map((s) => ({ value: s.value, label: s.label })),
          { value: "all" as const, label: "All" },
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold", filter === f.value ? "bg-forest text-ivory" : "bg-white text-ink hover:bg-ink/5")}
          >
            {f.label}
            {f.value !== "active" && f.value !== "all" && rows && <span className="ml-1.5 opacity-70">{counts(f.value)}</span>}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-9 w-48 rounded-full border border-ink/15 bg-white pl-8 pr-3 text-sm focus:border-forest focus:outline-none" />
        </div>
        <button type="button" onClick={refresh} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 text-sm font-semibold hover:border-ink">
          <RefreshCw size={14} /> Refresh
        </button>
        <button type="button" onClick={exportCsv} disabled={!shown.length} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 text-sm font-semibold hover:border-ink disabled:opacity-40">
          <Download size={14} /> CSV
        </button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {!rows && !error && <p className="mt-10 text-center text-ink-soft">Loading leads…</p>}
      {rows && shown.length === 0 && <p className="mt-10 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">No leads here yet.</p>}

      <ul className="mt-5 space-y-3">
        {shown.map((r) => {
          const raw = (r.phone ?? "").replace(/[^\d]/g, "");
          const digits = raw.length === 10 ? `91${raw}` : raw;
          const isOpen = open === r.id;
          return (
            <li key={r.id} className="rounded-2xl border border-ink/10 bg-white">
              <button type="button" onClick={() => setOpen(isOpen ? null : r.id)} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-left">
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", statusCls(r.status))}>{statuses.find((s) => s.value === r.status)?.label}</span>
                <span className="font-semibold text-ink">{r.name}</span>
                {r.company && <span className="text-sm text-ink-muted">· {r.company}</span>}
                <span className="flex items-center gap-1 text-sm text-ink-muted">
                  <Calendar size={14} /> {intentLabel(r)}
                  {r.challenge ? ` · ${r.challenge}` : ""}
                </span>
                <span className="ml-auto text-xs text-ink-soft">{r.createdAt ? fmt.format(r.createdAt) : ""}</span>
              </button>
              {isOpen && (
                <div className="grid gap-5 border-t border-ink/10 p-4 lg:grid-cols-[1fr_300px]">
                  <div className="space-y-3 text-sm">
                    {(r.outcome || r.message) && <p className="whitespace-pre-wrap rounded-xl bg-ivory-50 p-3 text-ink">{r.outcome || r.message}</p>}
                    <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                      {[
                        ["Audit score", r.score !== undefined ? `${r.score}/100` : undefined],
                        ["Weakest pillar", r.weakest],
                        ["Area", r.area],
                        ["Source", r.source],
                        ["Challenge", r.challenge],
                        ["Industry", r.industry],
                        ["Budget", r.budget],
                        ["Channels today", r.channels?.join(", ")],
                        ["Email", r.email],
                        ["Phone", r.phone],
                        ["Website", r.website],
                        ["Page", r.page],
                      ]
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <div key={k as string}>
                            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{k}</dt>
                            <dd className="break-words text-ink">{v}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {digits && (
                        <a href={`https://wa.me/${digits}?text=${encodeURIComponent(r.intent === "audit" ? `Hi ${r.name.split(" ")[0]}, this is Springs 360. Thanks for taking the growth audit${r.company ? ` for ${r.company}` : ""}: you scored ${r.score}/100, and your biggest opportunity is ${r.weakest ?? "follow-up"}. Here's what we found:` : `Hi ${r.name.split(" ")[0]}, this is Springs 360 — thanks for reaching out.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-sm font-semibold text-white">
                          <MessageCircle size={15} /> WhatsApp
                        </a>
                      )}
                      {r.email && <a href={`mailto:${r.email}?subject=${encodeURIComponent("Springs 360 — your enquiry")}`} className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-2 text-sm font-semibold text-ivory">
                        <Mail size={15} /> Email
                      </a>}
                      {digits && (
                        <a href={`tel:+${digits}`} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 text-sm font-semibold">
                          <Phone size={15} /> Call
                        </a>
                      )}
                      {r.website && (
                        <a href={/^https?:/.test(r.website) ? r.website : `https://${r.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 text-sm font-semibold">
                          <Globe size={15} /> Site
                        </a>
                      )}
                    </div>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</span>
                      <select value={r.status} onChange={(e) => setStatus(r, e.target.value as RequestStatus)} className="h-10 w-full rounded-xl border border-ink/15 bg-white px-3 text-sm">
                        {statuses.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink-soft">Private notes</span>
                      <textarea defaultValue={r.notes ?? ""} onBlur={(e) => saveNotes(r, e.target.value)} className="min-h-[90px] w-full rounded-xl border border-ink/15 p-3 text-sm" placeholder="Saved when you click outside" />
                    </label>
                    <button type="button" onClick={() => remove(r)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9B2C2C] hover:underline">
                      <Trash2 size={14} /> Delete lead
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
