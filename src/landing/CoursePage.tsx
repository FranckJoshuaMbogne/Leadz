import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Clock, PlayCircle, Signal, User } from "lucide-react";
import { HeroField } from "@/components/art/HeroField";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import NotFound from "@/pages/NotFound";
import { Seo } from "@/lib/seo";
import { track } from "@/lib/analytics";
import { fetchCourse } from "./api";
import { Checkout } from "./Checkout";
import { CourseCover, Price } from "./Courses";
import { mediaPath } from "./LandingView";
import { FloatingWhatsApp, LpFooter, LpHeader, lpBtn } from "./ui";
import type { Course } from "./types";

export default function CoursePage() {
  const { slug = "" } = useParams();
  const [course, setCourse] = useState<Course | null | undefined>(undefined);
  const [buy, setBuy] = useState(false);

  useEffect(() => {
    fetchCourse(slug).then((c) => {
      setCourse(c);
      if (c) track("view_item", { course: c.slug, value: c.price });
    });
  }, [slug]);

  if (course === undefined) return <div className="min-h-screen bg-deep" aria-busy="true" />;
  if (course === null)
    return (
      <>
        <Navbar />
        <main id="main">
          <NotFound />
        </main>
        <Footer />
      </>
    );

  const buyBtn = (
    <button type="button" className={lpBtn} onClick={() => setBuy(true)}>
      Get the full course <span aria-hidden="true">→</span>
    </button>
  );

  return (
    <>
      <Seo title={course.title} description={course.subtitle || course.description.slice(0, 155)} path={`/courses/${course.slug}`} image={mediaPath(course.cover)} />
      <LpHeader
        tag="Online training"
        right={
          <Link to="/learn" className="rounded-full border border-ivory/25 px-4 py-2 text-sm font-semibold hover:border-ivory">
            My courses
          </Link>
        }
      />
      <main id="main">
        <section className="on-dark relative isolate overflow-hidden bg-deep text-ivory">
          <HeroField className="absolute inset-0 -z-10 h-full w-full opacity-25" />
          <div className="container-site grid items-center gap-10 pb-16 pt-28 sm:pt-36 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div className="flex min-w-0 flex-col gap-5">
              <Link to="/training" className="eyebrow text-gold-light hover:underline">
                ← All courses
              </Link>
              <h1 className="text-balance font-display text-display-lg font-extrabold">{course.title}</h1>
              {course.subtitle && <p className="text-lead text-ivory/75">{course.subtitle}</p>}
              <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ivory/70">
                {course.duration && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={15} /> {course.duration}
                  </span>
                )}
                {course.level && (
                  <span className="inline-flex items-center gap-1.5">
                    <Signal size={15} /> {course.level}
                  </span>
                )}
                {course.instructor && (
                  <span className="inline-flex items-center gap-1.5">
                    <User size={15} /> {course.instructor}
                  </span>
                )}
              </p>
              <div className="flex flex-col gap-4 rounded-2xl bg-ivory-50 p-5 text-ink xs:flex-row xs:items-center xs:justify-between">
                <Price course={course} large />
                {buyBtn}
              </div>
            </div>
            <div className="min-w-0">
              <div className="overflow-hidden rounded-[1.5rem] bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
                {course.previewVideo ? (
                  <VideoEmbed src={course.previewVideo} title={`${course.title} free preview`} />
                ) : (
                  <div className="aspect-video">
                    <CourseCover course={course} />
                  </div>
                )}
              </div>
              {course.previewVideo && (
                <p className="mt-3 flex items-center gap-2 text-sm text-ivory/70">
                  <PlayCircle size={16} /> Free preview. Watch it before you buy.
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="bg-ivory-100">
          <div className="container-site grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0 space-y-12">
              {course.description && (
                <section>
                  <h2 className="font-display text-display-sm font-bold text-ink">About this course</h2>
                  <p className="mt-4 max-w-prose whitespace-pre-line text-lead text-ink-muted">{course.description}</p>
                </section>
              )}
              {course.outcomes?.filter(Boolean).length > 0 && (
                <section>
                  <h2 className="font-display text-display-sm font-bold text-ink">What you'll be able to do</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {course.outcomes.filter(Boolean).map((o) => (
                      <li key={o} className="flex gap-3 text-ink">
                        <Check size={20} className="mt-0.5 shrink-0 text-forest-500" /> {o}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {!!course.syllabus?.length && (
                <section>
                  <h2 className="font-display text-display-sm font-bold text-ink">Lessons</h2>
                  <ol className="mt-5 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
                    {course.syllabus.map((l, i) => (
                      <li key={i} className="flex items-center gap-4 px-5 py-4">
                        <span className="w-6 shrink-0 text-sm font-semibold tabular-nums text-ink-soft">{i + 1}</span>
                        <span className="min-w-0 flex-1 text-ink">{l.title}</span>
                        {l.duration && <span className="shrink-0 text-sm tabular-nums text-ink-soft">{l.duration}</span>}
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </div>
            <aside className="min-w-0">
              <div className="sticky top-6 grid gap-5 rounded-[1.5rem] border border-ink/10 bg-white p-6">
                <Price course={course} large />
                {course.includes?.filter(Boolean).length > 0 && (
                  <ul className="grid gap-2.5">
                    {course.includes.filter(Boolean).map((x) => (
                      <li key={x} className="flex gap-2.5 text-[0.95rem] text-ink">
                        <Check size={18} className="mt-0.5 shrink-0 text-forest-500" /> {x}
                      </li>
                    ))}
                  </ul>
                )}
                {buyBtn}
                <p className="text-sm text-ink-soft">Choose how to pay at checkout. Your access password is sent once we verify the payment.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <LpFooter />
      <FloatingWhatsApp text={`Hi Springs 360, I have a question about the course "${course.title}".`} />
      {buy && <Checkout course={course} onClose={() => setBuy(false)} />}
    </>
  );
}
