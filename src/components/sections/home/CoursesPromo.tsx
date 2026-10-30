import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Reveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fetchCourses, fetchLandingPage } from "@/landing/api";
import { builtInPages } from "@/landing/defaults";
import { CourseCard, PreviewModal } from "@/landing/Courses";
import type { Course, LandingPage } from "@/landing/types";

/**
 * Home page block for the online courses (springs360.in/training).
 * Shows up to three published courses; texts follow the training page in /admin.
 */
export function CoursesPromo() {
  const navigate = useNavigate();
  const [page, setPage] = useState<LandingPage>(() => builtInPages.training());
  const [courses, setCourses] = useState<Course[]>([]);
  const [preview, setPreview] = useState<Course | null>(null);

  useEffect(() => {
    fetchLandingPage("training")
      .then((p) => {
        if (p && p.template === "courses") setPage(p);
        return fetchCourses().then((all) => {
          const pick = p?.courses.slugs.filter(Boolean) ?? [];
          const list = pick.length ? (pick.map((s) => all.find((c) => c.slug === s)).filter(Boolean) as Course[]) : all;
          setCourses(list.slice(0, 3));
        });
      })
      .catch(() => {});
  }, []);

  const buy = (c: Course) => navigate(`/courses/${c.slug}`);

  return (
    <section aria-labelledby="courses-promo-title" className="bg-ivory-200/60 py-section">
      <div className="container-site">
        <SectionHeader
          eyebrow="Online courses"
          title={
            <span id="courses-promo-title">
              Learn the skills <em className="italic">we use for clients.</em>
            </span>
          }
          intro={page.hero.text}
        />
        {courses.length > 0 && (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.08} className="grid">
                <CourseCard course={c} onPreview={() => setPreview(c)} onBuy={() => buy(c)} />
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-12 flex flex-col gap-4 xs:flex-row xs:items-center xs:gap-8">
          <ButtonLink to="/training" variant="primary">
            {courses.length ? "See all courses" : page.hero.ctaLabel || "See the courses"}
          </ButtonLink>
          <span className="text-sm text-ink-muted">Free preview on every course.</span>
        </Reveal>
      </div>
      {preview && (
        <PreviewModal
          course={preview}
          onClose={() => setPreview(null)}
          onBuy={() => {
            const c = preview;
            setPreview(null);
            buy(c);
          }}
        />
      )}
    </section>
  );
}
