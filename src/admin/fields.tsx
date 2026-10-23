import { useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Copy, ImagePlus, Link2, Loader2, Plus, Trash2, X } from "lucide-react";
import type { Content } from "@/content/types";
import { useMedia } from "@/content/ContentProvider";
import { cn } from "@/lib/utils";
import { uploadImage } from "./api";

/* ------------------------------------------------------------------ */
/* Field schema                                                        */
/* ------------------------------------------------------------------ */

export type RefSource = "services" | "pillars" | "industries" | "work" | "catalog";

export type Field =
  | { k: string; label: string; type: "text" | "url" | "textarea" | "month" | "color" | "number"; hint?: string; placeholder?: string }
  | { k: string; label: string; type: "L"; multiline?: boolean; hint?: string }
  | { k: string; label: string; type: "bool"; hint?: string }
  | { k: string; label: string; type: "select"; options: { value: string; label: string }[]; hint?: string }
  | { k: string; label: string; type: "image"; hint?: string; maxSide?: number }
  | { k: string; label: string; type: "images"; hint?: string }
  | { k: string; label: string; type: "tags"; hint?: string }
  | { k: string; label: string; type: "Llist"; multiline?: boolean; hint?: string; addLabel?: string }
  | { k: string; label: string; type: "slist"; multiline?: boolean; hint?: string; addLabel?: string }
  | { k: string; label: string; type: "refs" | "ref"; source: RefSource; hint?: string }
  | { k: string; label: string; type: "group"; fields: Field[]; hint?: string }
  | { k: string; label: string; type: "list"; fields: Field[]; itemTitle: (item: any, i: number) => string; newItem: () => any; hint?: string; addLabel?: string };

/* eslint-disable @typescript-eslint/no-explicit-any */
type Obj = Record<string, any>;

export const inputCls =
  "block w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-soft/70 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15";

function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="text-sm font-semibold text-ink">{children}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink-soft">{hint}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

export function FieldsForm({ fields, value, onChange, content }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void; content: Content }) {
  return (
    <div className="grid gap-5">
      {fields.map((f) => (
        <FieldInput key={f.k} field={f} value={value?.[f.k]} onChange={(v) => onChange({ ...value, [f.k]: v })} content={content} />
      ))}
    </div>
  );
}

export function FieldInput({ field: f, value, onChange, content }: { field: Field; value: any; onChange: (v: any) => void; content: Content }) {
  switch (f.type) {
    case "text":
    case "url":
    case "month":
    case "number":
      return (
        <label className="block">
          <Label hint={f.hint}>{f.label}</Label>
          <input
            className={inputCls}
            type={f.type === "url" ? "url" : f.type === "month" ? "month" : f.type === "number" ? "number" : "text"}
            value={value ?? ""}
            placeholder={f.placeholder}
            onChange={(e) => onChange(f.type === "number" ? (e.target.value === "" ? 0 : Number(e.target.value)) : e.target.value)}
          />
        </label>
      );
    case "color":
      return (
        <label className="block">
          <Label hint={f.hint}>{f.label}</Label>
          <div className="flex items-center gap-2">
            <input type="color" className="h-11 w-14 cursor-pointer rounded-lg border border-ink/15 bg-white p-1" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} />
            <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
          </div>
        </label>
      );
    case "textarea":
      return (
        <label className="block">
          <Label hint={f.hint}>{f.label}</Label>
          <textarea className={cn(inputCls, "min-h-[96px]")} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        </label>
      );
    case "L":
      return <LInput label={f.label} hint={f.hint} multiline={f.multiline} value={value} onChange={onChange} />;
    case "bool":
      return (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/10 bg-white p-3.5">
          <input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#123B2A]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span>
            <span className="block text-sm font-semibold text-ink">{f.label}</span>
            {f.hint && <span className="block text-xs text-ink-soft">{f.hint}</span>}
          </span>
        </label>
      );
    case "select":
      return (
        <label className="block">
          <Label hint={f.hint}>{f.label}</Label>
          <select className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      );
    case "image":
      return <ImageInput label={f.label} hint={f.hint} value={value} onChange={onChange} maxSide={f.maxSide} />;
    case "images":
      return <ImagesInput label={f.label} hint={f.hint} value={value ?? []} onChange={onChange} />;
    case "tags":
      return <TagsInput label={f.label} hint={f.hint} value={value ?? []} onChange={onChange} />;
    case "slist":
      return <SListInput label={f.label} hint={f.hint} multiline={f.multiline} value={value ?? []} onChange={onChange} addLabel={f.addLabel} />;
    case "Llist":
      return <LListInput label={f.label} hint={f.hint} multiline={f.multiline} value={value ?? []} onChange={onChange} addLabel={f.addLabel} />;
    case "refs":
    case "ref":
      return <RefsInput field={f} value={value} onChange={onChange} content={content} />;
    case "group":
      return (
        <fieldset className="rounded-2xl border border-ink/10 bg-ivory-50 p-4">
          <legend className="px-1 text-sm font-semibold text-ink">{f.label}</legend>
          {f.hint && <p className="mb-3 text-xs text-ink-soft">{f.hint}</p>}
          <FieldsForm fields={f.fields} value={value ?? {}} onChange={onChange} content={content} />
        </fieldset>
      );
    case "list":
      return <ListInput field={f} value={value ?? []} onChange={onChange} content={content} />;
  }
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

function LInput({ label, hint, multiline, value, onChange }: { label: string; hint?: string; multiline?: boolean; value: any; onChange: (v: any) => void }) {
  const v = value ?? { en: "", fr: "" };
  const Tag = multiline ? "textarea" : "input";
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="grid gap-2 md:grid-cols-2">
        {(["en", "fr"] as const).map((l) => (
          <div key={l} className="relative">
            <span className="pointer-events-none absolute left-3 top-2.5 rounded bg-sage-100 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-forest">{l}</span>
            <Tag
              className={cn(inputCls, "pl-12", multiline && "min-h-[96px]")}
              value={v[l] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...v, [l]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ImagePreview({ src, className }: { src?: string; className?: string }) {
  const url = useMedia(src);
  if (!url) return <div className={cn("flex items-center justify-center bg-ink/[0.04] text-xs text-ink-soft", className)}>No image</div>;
  return <img src={url} alt="" className={cn("object-cover", className)} />;
}

function useUpload(onDone: (ref: string) => void, maxSide?: number) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      for (const file of Array.from(files)) onDone(await uploadImage(file, maxSide));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }
  return { busy, error, ref, handle };
}

function ImageInput({ label, hint, value, onChange, maxSide }: { label: string; hint?: string; value?: string; onChange: (v: string) => void; maxSide?: number }) {
  const up = useUpload(onChange, maxSide);
  const [showUrl, setShowUrl] = useState(false);
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <ImagePreview src={value} className="h-32 w-full shrink-0 rounded-xl border border-ink/10 sm:w-48" />
        <div className="flex flex-wrap gap-2">
          <input ref={up.ref} type="file" accept="image/*" className="hidden" onChange={(e) => up.handle(e.target.files)} />
          <button type="button" onClick={() => up.ref.current?.click()} disabled={up.busy} className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-ivory hover:bg-deep disabled:opacity-60">
            {up.busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />} {value ? "Replace" : "Upload"}
          </button>
          <button type="button" onClick={() => setShowUrl((s) => !s)} className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:border-ink">
            <Link2 size={16} /> Use a link
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-2 rounded-full border border-[#9B2C2C]/30 px-4 py-2 text-sm font-semibold text-[#9B2C2C] hover:bg-[#9B2C2C]/5">
              <X size={16} /> Remove
            </button>
          )}
          {showUrl && <input className={cn(inputCls, "basis-full")} placeholder="https://…" value={value?.startsWith("media:") ? "" : value ?? ""} onChange={(e) => onChange(e.target.value)} />}
          {up.error && <p className="basis-full text-sm text-[#9B2C2C]">{up.error}</p>}
        </div>
      </div>
    </div>
  );
}

function ImagesInput({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
  const list = useRef(value);
  list.current = value;
  const up = useUpload((ref) => onChange((list.current = [...list.current, ref])));
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={src + i} className="group relative">
            <ImagePreview src={src} className="aspect-[4/3] w-full rounded-xl border border-ink/10" />
            <div className="absolute right-1.5 top-1.5 flex gap-1">
              {i > 0 && (
                <button type="button" aria-label="Move left" onClick={() => onChange(move(value, i, i - 1))} className="rounded-full bg-white/90 p-1.5 shadow">
                  <ArrowUp size={13} className="-rotate-90" />
                </button>
              )}
              <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded-full bg-white/90 p-1.5 text-[#9B2C2C] shadow">
                <X size={13} />
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => up.ref.current?.click()} disabled={up.busy} className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink/20 text-sm font-semibold text-ink-muted hover:border-forest hover:text-forest">
          {up.busy ? <Loader2 className="animate-spin" /> : <ImagePlus />} Add images
        </button>
        <input ref={up.ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => up.handle(e.target.files)} />
      </div>
      {up.error && <p className="mt-2 text-sm text-[#9B2C2C]">{up.error}</p>}
    </div>
  );
}

function TagsInput({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((x) => x.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts]);
    setDraft("");
  };
  return (
    <div>
      <Label hint={hint ?? "Type and press Enter (or separate with commas)."}>{label}</Label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-ink/15 bg-white p-2">
        {value.map((t, i) => (
          <span key={t + i} className="inline-flex items-center gap-1 rounded-full bg-sage-100 py-1 pl-3 pr-1.5 text-sm font-medium text-forest">
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded-full p-0.5 hover:bg-forest/10">
              <X size={13} />
            </button>
          </span>
        ))}
        <input
          className="min-w-[8rem] flex-1 bg-transparent px-2 py-1 text-sm focus:outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder="Add…"
        />
      </div>
    </div>
  );
}

function LListInput({ label, hint, multiline, value, onChange, addLabel }: { label: string; hint?: string; multiline?: boolean; value: any[]; onChange: (v: any[]) => void; addLabel?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2 rounded-xl border border-ink/10 bg-ivory-50 p-2.5">
            <div className="flex-1">
              <LInput label={`#${i + 1}`} multiline={multiline} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
            </div>
            <RowActions i={i} n={value.length} onMove={(to) => onChange(move(value, i, to))} onDelete={() => onChange(value.filter((_, j) => j !== i))} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, { en: "", fr: "" }])} className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/30 px-4 py-2 text-sm font-semibold text-ink-muted hover:border-forest hover:text-forest">
          <Plus size={15} /> {addLabel ?? "Add line"}
        </button>
      </div>
    </div>
  );
}

const sourceLabel: Record<RefSource, (c: Content) => { value: string; label: string }[]> = {
  services: (c) => c.services.map((d) => ({ value: d.slug, label: d.name })),
  pillars: (c) => c.pillars.map((d) => ({ value: d.slug, label: d.name })),
  industries: (c) => c.industries.map((d) => ({ value: d.slug, label: d.name })),
  work: (c) => c.work.map((d) => ({ value: d.slug, label: `${d.client} — ${d.title}` })),
  catalog: (c) => c.catalog.map((d) => ({ value: d.slug, label: d.label })),
};

function SListInput({ label, hint, multiline, value, onChange, addLabel }: { label: string; hint?: string; multiline?: boolean; value: string[]; onChange: (v: string[]) => void; addLabel?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            {multiline ? (
              <textarea className={cn(inputCls, "min-h-[72px] flex-1")} value={item} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
            ) : (
              <input className={cn(inputCls, "flex-1")} value={item} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
            )}
            <RowActions i={i} n={value.length} onMove={(to) => onChange(move(value, i, to))} onDelete={() => onChange(value.filter((_, j) => j !== i))} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, ""])} className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/30 px-4 py-2 text-sm font-semibold text-ink-muted hover:border-forest hover:text-forest">
          <Plus size={15} /> {addLabel ?? "Add line"}
        </button>
      </div>
    </div>
  );
}

function RefsInput({ field, value, onChange, content }: { field: Extract<Field, { type: "refs" | "ref" }>; value: any; onChange: (v: any) => void; content: Content }) {
  const opts = sourceLabel[field.source](content);
  if (field.type === "ref") {
    return (
      <label className="block">
        <Label hint={field.hint}>{field.label}</Label>
        <select className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)}>
          <option value="">— None —</option>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
  const sel: string[] = value ?? [];
  return (
    <div>
      <Label hint={field.hint}>{field.label}</Label>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => {
          const on = sel.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? sel.filter((x) => x !== o.value) : [...sel, o.value])}
              className={cn("rounded-full border px-3 py-1.5 text-sm font-medium transition-colors", on ? "border-forest bg-forest text-ivory" : "border-ink/15 bg-white text-ink hover:border-ink/40")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = arr.slice();
  const [x] = copy.splice(from, 1);
  copy.splice(to, 0, x);
  return copy;
}

export function RowActions({ i, n, onMove, onDelete, onDuplicate }: { i: number; n: number; onMove: (to: number) => void; onDelete: () => void; onDuplicate?: () => void }) {
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => onMove(i - 1)} className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5 disabled:opacity-30">
        <ArrowUp size={15} />
      </button>
      <button type="button" aria-label="Move down" disabled={i === n - 1} onClick={() => onMove(i + 1)} className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5 disabled:opacity-30">
        <ArrowDown size={15} />
      </button>
      {onDuplicate && (
        <button type="button" aria-label="Duplicate" onClick={onDuplicate} className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5">
          <Copy size={15} />
        </button>
      )}
      <button
        type="button"
        aria-label="Delete"
        onClick={() => {
          if (window.confirm("Delete this item?")) onDelete();
        }}
        className="rounded-lg p-1.5 text-[#9B2C2C] hover:bg-[#9B2C2C]/10"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function ListInput({ field, value, onChange, content }: { field: Extract<Field, { type: "list" }>; value: any[]; onChange: (v: any[]) => void; content: Content }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <Label hint={field.hint}>{field.label}</Label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="rounded-xl border border-ink/10 bg-white">
            <div className="flex items-center gap-2 p-2 pl-3">
              <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex flex-1 items-center gap-2 text-left text-sm font-semibold text-ink">
                <ChevronDown size={16} className={cn("shrink-0 transition-transform", open === i && "rotate-180")} />
                <span className="truncate">{field.itemTitle(item, i) || `Item ${i + 1}`}</span>
              </button>
              <div className="flex gap-1">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))} className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5 disabled:opacity-30">
                  <ArrowUp size={15} />
                </button>
                <button type="button" aria-label="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))} className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5 disabled:opacity-30">
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={() => {
                    if (window.confirm("Delete this item?")) onChange(value.filter((_, j) => j !== i));
                  }}
                  className="rounded-lg p-1.5 text-[#9B2C2C] hover:bg-[#9B2C2C]/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            {open === i && (
              <div className="border-t border-ink/10 p-4">
                <FieldsForm fields={field.fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} content={content} />
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            onChange([...value, field.newItem()]);
            setOpen(value.length);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/30 px-4 py-2 text-sm font-semibold text-ink-muted hover:border-forest hover:text-forest"
        >
          <Plus size={15} /> {field.addLabel ?? "Add"}
        </button>
      </div>
    </div>
  );
}
