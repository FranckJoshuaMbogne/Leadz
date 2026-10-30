import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Loader2, Play, Send, Signal } from "lucide-react";
import { useMedia } from "@/content/ContentProvider";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { track } from "@/lib/analytics";
import { fetchCourses } from "./api";
import { Checkout } from "./Checkout";
import { Accent, Modal, lpBtn, money } from "./ui";
import type { Course, LandingPage } from "./types";

export function CourseCover({ course, className }: { course: Course; className?: string }) {
  const url = useMedia(course.cover);
  return url ? (
    <img src={url} alt="" className={className ?? "h-full w-full object-cover"} loading="lazy" />
  ) : (
    <div className="flex h-full w-full items-start bg-gradient-to-br from-forest-600 to-deep p-5">
      <span className="font-display text-xl font-bold leading-tight text-ivory/90">{course.title}</span>
    </div>
  );
}

export function Price({ course, large }: { course: Course; large?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className={large ? "text-3xl font-extrabold tabular-nums text-ink" : "text-xl font-extrabold tabular-nums text-ink"}>{money(course.price, course.currency)}</span>
      {course.compareAt > course.price && <span className="text-sm tabular-nums text-ink-soft line-through">{money(course.compareAt, course.currency)}</span>}
    </span>
  );
}

export function PreviewModal({ course, onClose, onBuy }: { course: Course; onClose: () => void; onBuy: () => void }) {
  useEffect(() => {
    track("view_item", { course: course.slug, preview: true });
  }, [course.slug]);
  return (
    <Modal title={`Free preview · ${course.title}`} onClose={onClose} wide>
      <div className="overflow-hidden rounded-2xl bg-black">{course.previewVideo ? <VideoEmbed src={course.previewVideo} title={`${course.title} preview`} /> : <p className="p-10 text-center text-ivory/70">Preview coming soon.</p>}</div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-ink">{course.title}</p>
          <Price course={course} />
        </div>
        <button type="button" className={lpBtn} onClick={onBuy}>
          Get the full course
        </button>
      </div>
    </Modal>
  );
}

export function CourseCard({ course, onPreview, onBuy }: { course: Course; onPreview: () => void; onBuy: () => void }) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white">
      <button type="button" onClick={onPreview} className="group relative aspect-video overflow-hidden bg-deep" aria-label={`Watch the free preview of ${course.title}`}>
        <CourseCover course={course} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute inset-0 flex items-center justify-center bg-deep/25 transition-colors group-hover:bg-deep/40">
          <span className="flex items-center gap-2 rounded-full bg-ivory/95 px-4 py-2.5 text-sm font-semibold text-deep shadow-lg">
            <Play size={16} className="fill-current" /> Free preview
          </span>
        </span>
      </button>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3 className="text-xl font-bold leading-snug text-ink">
          <Link to={`/courses/${course.slug}`} className="hover:underline">
            {course.title}
          </Link>
        </h3>
        {course.subtitle && <p className="text-[0.95rem] text-ink-muted">{course.subtitle}</p>}
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
          {course.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> {course.duration}
            </span>
          )}
          {course.level && (
            <span className="inline-flex items-center gap-1.5">
              <Signal size={14} /> {course.level}
            </span>
          )}
          {course.hasGroup && (
            <span className="inline-flex items-center gap-1.5">
              <Send size={14} /> Private group
            </span>
          )}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <Price course={course} />
          <button type="button" onClick={onBuy} className="inline-flex min-h-[44px] items-center rounded-full bg-forest px-5 text-sm font-semibold text-ivory hover:bg-deep">
            Buy course
          </button>
        </div>
      </div>
    </article>
  );
}

/** Course list used by the "Online training" landing template. */
export function CourseGrid({ page }: { page: LandingPage }) {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [preview, setPreview] = useState<Course | null>(null);
  const [buy, setBuy] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses()
      .then((all) => {
        const pick = page.courses.slugs.filter(Boolean);
        setCourses(pick.length ? (pick.map((s) => all.find((c) => c.slug === s)).filter(Boolean) as Course[]) : all);
      })
      .catch(() => setCourses([]));
  }, [page.courses.slugs]);

  return (
    <section id="courses" className="scroll-mt-6 border-t border-ink/10 py-16 sm:py-24">
      <div className="container-site">
        <div className="mb-10 max-w-3xl">
          {page.courses.eyebrow && <p className="eyebrow text-forest-500">{page.courses.eyebrow}</p>}
          {page.courses.title && (
            <h2 className="mt-4 text-balance font-display text-display-md font-bold text-ink">
              <Accent text={page.courses.title} emClass="text-forest-500" />
            </h2>
          )}
          {page.courses.text && <p className="mt-4 text-lead text-ink-muted">{page.courses.text}</p>}
        </div>
        {!courses ? (
          <p className="flex items-center gap-2 text-ink-soft">
            <Loader2 size={18} className="animate-spin" /> Loading courses…
          </p>
        ) : courses.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-muted">New courses are being recorded. Check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.slug} course={c} onPreview={() => setPreview(c)} onBuy={() => setBuy(c)} />
            ))}
          </div>
        )}
      </div>
      {preview && (
        <PreviewModal
          course={preview}
          onClose={() => setPreview(null)}
          onBuy={() => {
            setBuy(preview);
            setPreview(null);
          }}
        />
      )}
      {buy && <Checkout course={buy} onClose={() => setBuy(null)} />}
    </section>
  );
}
