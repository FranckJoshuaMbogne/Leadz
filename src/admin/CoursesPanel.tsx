import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { useContent } from "@/content/ContentProvider";
import { money } from "@/landing/ui";
import { cn, slugify } from "@/lib/utils";
import { FieldsForm, type Field } from "./fields";
import { deleteCourse, listCoursesAdmin, saveCourse, type CourseWithLessons } from "./landingApi";

const courseFields: Field[] = [
  { k: "title", label: "Course title", type: "text" },
  { k: "slug", label: "URL", type: "text", hint: "springs360.in/courses/<this>. Filled from the title if empty." },
  {
    k: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "published", label: "Published (for sale)" },
      { value: "draft", label: "Draft (hidden)" },
    ],
  },
  { k: "subtitle", label: "One-line promise", type: "text", hint: "e.g. Run Google Ads that bring calls in 7 days." },
  { k: "previewVideo", label: "Free preview video (about 30 seconds)", type: "url", hint: "YouTube, Vimeo, Google Drive or .mp4 link. Everyone can watch this." },
  { k: "cover", label: "Cover image", type: "image", hint: "16:9 works best." },
  { k: "price", label: "Price", type: "number" },
  { k: "compareAt", label: "Old price (optional, shown crossed out)", type: "number" },
  {
    k: "currency",
    label: "Currency",
    type: "select",
    options: [
      { value: "INR", label: "₹ INR" },
      { value: "USD", label: "$ USD" },
      { value: "EUR", label: "€ EUR" },
    ],
  },
  { k: "duration", label: "Total length", type: "text", placeholder: "3h 40m" },
  { k: "level", label: "Level", type: "text", placeholder: "Beginner" },
  { k: "instructor", label: "Instructor", type: "text" },
  { k: "description", label: "About this course", type: "textarea" },
  { k: "outcomes", label: "What learners will be able to do", type: "slist", addLabel: "Add outcome" },
  { k: "includes", label: "What's included (price box)", type: "slist", addLabel: "Add item", hint: "e.g. 24 video lessons · Templates · WhatsApp support" },
  { k: "order", label: "Position in lists (lower = first)", type: "number" },
];

const groupFields: Field[] = [
  { k: "groupLink", label: "Course group link (Telegram)", type: "url", hint: "Only shown to learners who unlocked the course. Tip: create the invite link with “Request admin approval” on, so you approve each member." },
  { k: "groupNote", label: "Message shown with the link", type: "textarea", placeholder: "Join to get lesson summaries, projects, home classes and to chat with other learners." },
  { k: "groupLabel", label: "Public line on the course page", type: "text", hint: "Shown to everyone (without the link), e.g. Private Telegram group: summaries, projects, home classes." },
];

const lessonFields: Field[] = [
  {
    k: "lessons",
    label: "Lessons (full course, only for people who unlocked it)",
    type: "list",
    addLabel: "Add lesson",
    hint: "Lesson titles and lengths are shown publicly on the course page. Videos are only shown after unlocking. Use Vimeo with domain privacy (springs360.in) so the links can't be played elsewhere.",
    itemTitle: (l) => l.title,
    newItem: () => ({ title: "", duration: "", video: "", notes: "" }),
    fields: [
      { k: "title", label: "Lesson title", type: "text" },
      { k: "duration", label: "Length", type: "text", placeholder: "8:30" },
      { k: "video", label: "Video link", type: "url" },
      { k: "notes", label: "Notes under the video", type: "textarea" },
    ],
  },
];

const blank = (): CourseWithLessons => ({
  slug: "",
  status: "draft",
  order: 10,
  title: "",
  subtitle: "",
  description: "",
  cover: "",
  previewVideo: "",
  price: 0,
  compareAt: 0,
  currency: "INR",
  duration: "",
  level: "",
  instructor: "Springs 360",
  outcomes: [],
  includes: [],
  lessons: [],
  groupLink: "",
  groupNote: "",
  groupLabel: "Private Telegram group: lesson summaries, projects, home classes and chat with other learners",
});

function CourseEditor({ initial, isNew, onDone }: { initial: CourseWithLessons; isNew: boolean; onDone: () => void }) {
  const content = useContent();
  const [c, setC] = useState(initial);
  const [prev, setPrev] = useState(isNew ? undefined : initial.slug);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [base, setBase] = useState(isNew ? null : initial);
  const dirty = useMemo(() => JSON.stringify(c) !== JSON.stringify(base), [c, base]);

  async function save() {
    const slug = slugify(c.slug || c.title);
    if (!c.title.trim() || !slug) return setMsg({ ok: false, text: "Give the course a title." });
    if (c.status === "published" && !(Number(c.price) > 0)) return setMsg({ ok: false, text: "Set a price before publishing." });
    setBusy(true);
    setMsg(null);
    try {
      const next = { ...c, slug };
      await saveCourse(next, prev);
      setC(next);
      setBase(next);
      setPrev(slug);
      setMsg({ ok: true, text: next.status === "published" ? "Saved. It's on sale now." : "Saved as a draft." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? `Could not save: ${e.message}` : "Could not save." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pb-24">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => (!dirty || window.confirm("Leave without saving?")) && onDone()} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-2 text-sm font-semibold hover:border-ink">
          <ArrowLeft size={15} /> All courses
        </button>
        <h2 className="mr-auto truncate text-xl font-bold text-ink">{c.title || "New course"}</h2>
        {prev && c.status === "published" && (
          <a href={`/courses/${prev}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-2 text-sm font-semibold hover:border-ink">
            <ExternalLink size={14} /> View
          </a>
        )}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
          <FieldsForm fields={courseFields} value={c} onChange={(v) => setC(v as CourseWithLessons)} content={content} />
        </div>
        <div className="grid h-fit gap-6">
          <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
            <p className="mb-4 text-sm font-bold text-ink">Course group</p>
            <FieldsForm fields={groupFields} value={c} onChange={(v) => setC(v as CourseWithLessons)} content={content} />
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
            <FieldsForm fields={lessonFields} value={c} onChange={(v) => setC(v as CourseWithLessons)} content={content} />
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur lg:pl-[17rem]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          {msg ? <p className={cn("text-sm font-semibold", msg.ok ? "text-emerald-700" : "text-[#9B2C2C]")}>{msg.text}</p> : <p className="text-sm text-ink-muted">{dirty ? "You have unsaved changes." : "No changes."}</p>}
          <button type="button" onClick={save} disabled={busy} className="ml-auto inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2 text-sm font-semibold text-ivory hover:bg-deep disabled:opacity-60">
            {busy && <Loader2 size={15} className="animate-spin" />} Save course
          </button>
        </div>
      </div>
    </div>
  );
}

export function CoursesPanel() {
  const [rows, setRows] = useState<CourseWithLessons[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ c: CourseWithLessons; isNew: boolean } | null>(null);

  async function refresh() {
    setError("");
    try {
      setRows(await listCoursesAdmin());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load courses. Deploy the latest firestore.rules.");
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  if (editing)
    return (
      <CourseEditor
        key={editing.c.slug + String(editing.isNew)}
        initial={editing.c}
        isNew={editing.isNew}
        onDone={() => {
          setEditing(null);
          refresh();
        }}
      />
    );

  return (
    <div className="grid gap-5">
      <button type="button" onClick={() => setEditing({ c: blank(), isNew: true })} className="inline-flex w-fit items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-deep">
        <Plus size={16} /> New course
      </button>
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {!rows && !error && (
        <p className="flex items-center gap-2 text-ink-soft">
          <Loader2 size={18} className="animate-spin" /> Loading courses…
        </p>
      )}
      {rows?.length === 0 && <p className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">No courses yet. Add your first one: title, price, a 30-second preview link and the lesson videos.</p>}
      <ul className="grid gap-3">
        {rows?.map((c) => (
          <li key={c.slug} className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4">
            <button type="button" onClick={() => setEditing({ c, isNew: false })} className="min-w-0 flex-1 text-left">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink">{c.title}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase", c.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-ink/10 text-ink-muted")}>{c.status === "published" ? "On sale" : "Draft"}</span>
              </span>
              <span className="mt-0.5 block truncate text-sm text-ink-soft">
                {money(c.price, c.currency)} · {c.lessons.length} lesson{c.lessons.length === 1 ? "" : "s"} · {c.previewVideo ? "preview ✓" : "no preview yet"} · {c.groupLink ? "group ✓" : "no group"} · /courses/{c.slug}
              </span>
            </button>
            <button
              type="button"
              aria-label="Delete course"
              onClick={async () => {
                if (!window.confirm(`Delete “${c.title}” and its lessons? Learners who unlocked it lose access.`)) return;
                try {
                  await deleteCourse(c.slug);
                  refresh();
                } catch {
                  setError("Could not delete the course.");
                }
              }}
              className="rounded-full border border-[#9B2C2C]/30 p-2 text-[#9B2C2C] hover:bg-[#9B2C2C]/5"
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
