import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, ExternalLink, Plus, Trash2 } from "lucide-react";
import type { Content } from "@/content/types";
import { useMedia } from "@/content/ContentProvider";
import { cn } from "@/lib/utils";
import { FieldsForm, move, type Field } from "./fields";

/* eslint-disable @typescript-eslint/no-explicit-any */

function Thumb({ src }: { src?: string }) {
  const url = useMedia(src);
  return url ? <img src={url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" /> : <span className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-forest to-deep" />;
}

/**
 * List + form editor for an array of items (projects, experience…).
 * Changes stay in the draft until "Save changes" is clicked.
 */
export function CollectionEditor<T extends Record<string, any>>({
  items,
  onChange,
  fields,
  newItem,
  title,
  subtitle,
  thumb,
  viewHref,
  content,
  noun,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: Field[];
  newItem: () => T;
  title: (x: T) => string;
  subtitle?: (x: T) => string;
  thumb?: (x: T) => string | undefined;
  viewHref?: (x: T) => string | null;
  content: Content;
  noun: string;
}) {
  const [sel, setSel] = useState(0);
  const current = items[sel];

  const update = (v: T) => onChange(items.map((x, i) => (i === sel ? v : x)));
  const add = () => {
    onChange([newItem(), ...items]);
    setSel(0);
  };
  const duplicate = () => {
    const copy = JSON.parse(JSON.stringify(current));
    for (const k of ["slug", "id"]) if (typeof copy[k] === "string" && copy[k]) copy[k] = `${copy[k]}-copy`;
    if ("published" in copy) copy.published = false;
    onChange([...items.slice(0, sel + 1), copy, ...items.slice(sel + 1)]);
    setSel(sel + 1);
  };
  const remove = () => {
    if (!window.confirm(`Delete “${title(current)}”? This can't be undone after you save.`)) return;
    onChange(items.filter((_, i) => i !== sel));
    setSel(Math.max(0, sel - 1));
  };
  const shift = (to: number) => {
    if (to < 0 || to >= items.length) return;
    onChange(move(items, sel, to));
    setSel(to);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div>
        <button type="button" onClick={add} className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-ivory hover:bg-deep">
          <Plus size={16} /> Add {noun}
        </button>
        <ul className="max-h-[70vh] space-y-1.5 overflow-y-auto pr-1">
          {items.map((x, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setSel(i)}
                className={cn("flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors", i === sel ? "border-forest bg-forest/5" : "border-ink/10 bg-white hover:border-ink/30")}
              >
                {thumb && <Thumb src={thumb(x)} />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">{title(x) || "(untitled)"}</span>
                  {subtitle && <span className="block truncate text-xs text-ink-soft">{subtitle(x)}</span>}
                </span>
                {x.published === false && <span className="shrink-0 rounded-full bg-ink/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-ink-muted">Draft</span>}
                {x.featured && <span className="shrink-0 rounded-full bg-gold/25 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-gold-dark">Home</span>}
              </button>
            </li>
          ))}
          {items.length === 0 && <li className="rounded-xl border border-dashed border-ink/20 p-6 text-center text-sm text-ink-soft">Nothing yet.</li>}
        </ul>
      </div>

      {current ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-ink/10 pb-4">
            <h3 className="mr-auto truncate text-lg font-bold text-ink">{title(current) || "(untitled)"}</h3>
            <button type="button" onClick={() => shift(sel - 1)} disabled={sel === 0} className="rounded-full border border-ink/15 p-2 text-ink-muted hover:border-ink disabled:opacity-30" aria-label="Move up">
              <ArrowUp size={15} />
            </button>
            <button type="button" onClick={() => shift(sel + 1)} disabled={sel === items.length - 1} className="rounded-full border border-ink/15 p-2 text-ink-muted hover:border-ink disabled:opacity-30" aria-label="Move down">
              <ArrowDown size={15} />
            </button>
            <button type="button" onClick={duplicate} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 text-sm font-semibold text-ink hover:border-ink">
              <Copy size={14} /> Duplicate
            </button>
            {viewHref?.(current) && (
              <a href={viewHref(current)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 text-sm font-semibold text-ink hover:border-ink">
                <ExternalLink size={14} /> View
              </a>
            )}
            <button type="button" onClick={remove} className="inline-flex items-center gap-1.5 rounded-full border border-[#9B2C2C]/30 px-3 py-2 text-sm font-semibold text-[#9B2C2C] hover:bg-[#9B2C2C]/5">
              <Trash2 size={14} /> Delete
            </button>
          </div>
          <FieldsForm fields={fields} value={current} onChange={(v) => update(v as T)} content={content} />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-ink/20 p-10 text-ink-soft">Select or add a {noun}.</div>
      )}
    </div>
  );
}
